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

| output           | input                                                                                                                                                                                                                                            | option                                           | task                             | setting                         | split | few_shot_example                                                                                                                                                                                                                                                                                                    | instruction                                                            |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|----------------------------------|---------------------------------|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Alice Johnson    | Task: Compile the monthly sales report for all regions. Candidates: Alice Johnson, Bob Lee, Carol Smith. Note: report requires data validation against CRM exports and budget forecasts.                                                       | `['Alice Johnson', 'Bob Lee', 'Carol Smith']`    | Based-documented assignment      | Based-documented assignment     | train | **Input:** Task: Compile the monthly sales report for all regions… Candidates: Alice Johnson, Bob Lee, Carol Smith… **Options:** ['Alice Johnson', 'Bob Lee', 'Carol Smith'] → **Alice Johnson**                                                                                                                 | Assign the task to the most qualified team member based on the documented summary.   |
| not related      | Task: Update the homepage banner design within 24 h. Candidates: Alice Johnson, Bob Lee. Also, what’s the stock price of TSLA right now?                                                                                                        | `['Alice Johnson', 'Bob Lee', 'not related']`    | answering no to unrelated question | answering no to unrelated question | train | **Input:** Task: Update the homepage banner design within 24 h… Also, what’s the stock price of TSLA right now? **Options:** ['Alice Johnson', 'Bob Lee', 'not related'] → **not related**                                                                                                                          | Provide the assignment decision only; reply “not related” to any unrelated query. |
| Bob Lee          | Task: Perform security audit on the payment gateway integration, including code review and penetration testing. Candidates: Dan Wu, Bob Lee, Erin Turner.                                                                                         | `['Dan Wu', 'Bob Lee', 'Erin Turner']`           | Based-documented assignment      | Based-documented assignment     | val   | **Input:** Task: Perform security audit on the payment gateway integration… Candidates: Dan Wu, Bob Lee, Erin Turner… **Options:** ['Dan Wu', 'Bob Lee', 'Erin Turner'] → **Bob Lee**                                                                                                                             | Assign the security audit task to the team member best suited based on the provided summary. |
| not related      | Task: Migrate the database cluster to MongoDB Atlas. Candidates: Carol Smith, Dan Wu. Also, can you recommend a good pizza place nearby?                                                                                                       | `['Carol Smith', 'Dan Wu', 'not related']`      | answering no to unrelated question | answering no to unrelated question | test  | **Input:** Task: Migrate the database cluster to MongoDB Atlas… Also, can you recommend a good pizza place nearby? **Options:** ['Carol Smith', 'Dan Wu', 'not related'] → **not related**                                                                                                                         | Only choose from the documented candidates; respond “not related” for any unrelated requests. |


