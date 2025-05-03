# Hướng dẫn sử dụng `script.py`

Đây là hướng dẫn nhanh thiết lập môi trường và chạy fine‑tuning model bất kì với LoRA trên dataset ECInstruct.

## 1. Yêu cầu

* **Python** ≥ 3.8
* **GPU CUDA** (Ví dụ: Tesla T4, V100, A100)
* **Token Hugging Face** (HF\_TOKEN) đã đăng ký trên [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

## 2. Cài đặt môi trường

```bash
# Cập nhật pip và cài đặt thư viện
pip install --upgrade pip
pip install transformers accelerate peft datasets huggingface_hub
```

## 3. Cấu hình biến môi trường

Trước khi chạy script, hãy thiết lập biến `HF_TOKEN`:

```bash
export HF_TOKEN="YOUR_HF_TOKEN"
```

## 4. Chạy fine‑tuning

Sử dụng `accelerate` mới tính vào lựa chọn dùng GPU:

```bash
accelerate launch script.py
```

* Script sẽ tự động tải model `Qwen/Qwen2.5-7B-Instruct` và dataset `chưa setting` từ Hugging Face.
* Kết quả fine‑tuned model được lưu tại thư mục `Model_finetuned`.

## 5. Tùy chỉnh

* **model\_name** và **dataset\_id**: thay đổi ngay đầu file `script.py`.
* **Hyperparameters**: batch size, learning rate, LoRA config… trong phần `TrainingArguments` và `LoraConfig`.

## 6. Định dạng dữ liệu đầu vào

Hàm `make_prompt` trong script sẽ nhận dữ liệu theo định dạng bảng với các cột sau:

| output                             | input                                                                                   | option                                                           | task                              | setting                        | split   | few_shot_example                                                                                                                                                                               | instruction                                                                                                 |
|------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------|-----------------------------------|---------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Based-documented assignment        | Generate a task assignment doc for the Q2 marketing launch.                             | `['Based-documented assignment', 'answering no to unrelated question']` | IND_Single_Instruction            | IND_Single_Instruction          | train   | **Input:** Generate a task assignment doc for the Q2 marketing launch.  **Options:** ['Based-documented assignment', 'answering no to unrelated question'] → **Based-documented assignment** | Create a structured assignment based on documented marketing requirements.                                 |
| answering no to unrelated question | How many hours to build the dashboard? Also, what’s your favorite movie?                 | `['Based-documented assignment', 'answering no to unrelated question']` | IND_Diverse_Instruction           | IND_Diverse_Instruction         | train   | **Input:** How many hours to build the dashboard? Also, what’s your favorite movie?  **Options:** [...] → **answering no to unrelated question**                                            | Only answer the dashboard ETA; for any unrelated question reply “I cannot answer that.”                   |
| Based-documented assignment        | Please match this data-cleanup task to the right analyst using past performance logs.    | `['Based-documented assignment', 'answering no to unrelated question']` | OOD_Unseen_Instruction            | OOD_Unseen_Instruction          | val     | **Input:** Please match this data-cleanup task to the right analyst…  **Options:** [...] → **Based-documented assignment**                                                               | Assign the data-cleanup task by referencing analyst profiles and historical time-logs.                      |
| answering no to unrelated question | Estimate hours for writing the proposal; and do you know the latest football scores?    | `['Based-documented assignment', 'answering no to unrelated question']` | OOD_Diverse_Instruction_1-shot    | OOD_Diverse_Instruction_1-shot  | test    | **Input:** Estimate hours for writing the proposal; and do you know the latest football scores?  **Options:** [...] → **answering no to unrelated question**                              | Provide only the proposal ETA; for unrelated queries respond “I cannot answer that.”                      |

