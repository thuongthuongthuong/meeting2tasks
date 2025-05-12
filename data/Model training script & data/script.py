#!/usr/bin/env python3
"""
Fine-tune any model with instructed data with LoRA adapters.
Requires:
  - Python 3.8+
  - torch, transformers, datasets, peft, huggingface_hub
Usage:
  export HF_TOKEN="your_hf_token"
  accelerate launch script.py
"""
import os
from huggingface_hub import login

# Authenticate to HF using an environment variable
hf_token = os.getenv("HF_TOKEN")
if not hf_token:
    raise ValueError("Please set the HF_TOKEN environment variable with your Hugging Face token.")
login(token=hf_token)

import torch
from datasets import load_dataset, DatasetDict
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
    DataCollatorForSeq2Seq,
)
from peft import LoraConfig, get_peft_model, TaskType
from typing import Dict, Any


def make_prompt(example: Dict[str, Any]) -> str:
    """
    Build a single text prompt from the example fields.
    """
    parts = [
        f"### Task:\n{example.get('task', '')}",
        f"### Setting:\n{example.get('setting', '')}",
        f"### Instruction:\n{example.get('instruction', '')}",
    ]
    if example.get('few_shot_example'):
        parts.append(f"### Few-Shot Examples:\n{example['few_shot_example']}")
    if example.get('input'):
        parts.append(f"### Input:\n{example['input']}")
    if example.get('option'):
        parts.append(f"### Options:\n{example['option']}")
    parts.append("### Response:\n")
    return "\n\n".join(parts)


def preprocess_function(examples, tokenizer, max_length=1024):
    """
    Tokenize prompts and labels for the Trainer.
    """
    prompts = [make_prompt(ex) for ex in examples]
    model_inputs = tokenizer(
        prompts,
        max_length=max_length,
        truncation=True,
        padding=False,
    )

    # tokenize the target outputs
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(
            examples['output'],
            max_length=max_length,
            truncation=True,
            padding=False,
        )
    model_inputs['labels'] = labels['input_ids']
    return model_inputs


def main():
    model_name = "Qwen/Qwen2.5-7B-Instruct" # Specify the model name here
    dataset_id = "" # Specify the dataset ID here

    # Load dataset
    raw = load_dataset(dataset_id)
    splits = { 'train': raw['train'] }
    if 'validation' in raw:
        splits['validation'] = raw['validation']
    elif 'test' in raw:
        splits['validation'] = raw['test']
    ds = DatasetDict(splits)

    # Load tokenizer & model
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
    tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        trust_remote_code=True,
        device_map='auto',
        torch_dtype=torch.bfloat16,
    )

    # Apply LoRA
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        inference_mode=False,
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj"],
    )
    model = get_peft_model(model, peft_config)

    # Tokenize dataset
    tokenized = ds.map(
        lambda batch: preprocess_function(batch, tokenizer),
        batched=True,
        remove_columns=ds['train'].column_names,
    )

    # Data collator
    data_collator = DataCollatorForSeq2Seq(
        tokenizer,
        pad_to_multiple_of=8,
        return_tensors='pt',
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir='Model_finetuned',
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        evaluation_strategy='steps',
        eval_steps=500,
        learning_rate=3e-4,
        warmup_steps=200,
        max_steps=2000,
        save_steps=500,
        logging_steps=50,
        fp16=True,
        save_total_limit=3,
        load_best_model_at_end=True,
        report_to='none',
    )

    # Trainer setup
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized['train'],
        eval_dataset=tokenized.get('validation'),
        data_collator=data_collator,
        tokenizer=tokenizer,
    )

    # Train and save
    trainer.train()
    model.save_pretrained('mistral_lora_finetuned')


if __name__ == '__main__':
    main()
