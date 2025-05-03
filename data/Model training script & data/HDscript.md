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

từng attribute sẽ chứa như sau
+ `output`: Là câu trả lời duy nhất đúng cho ví dụ – tức là quyết định phân công hoàn chỉnh (ví dụ: “Alice Johnson sẽ tổng hợp báo cáo bán hàng hàng tháng cho tất cả các khu vực”).
+ `input` : Là nội dung đầu vào thô của người dùng, bao gồm mô tả công việc, danh sách ứng viên, và bất kỳ câu hỏi hay ghi chú không liên quan nào.
+ `option` : Là danh sách JSON các lựa chọn đầu ra mà mô hình có thể chọn (list các output tương ứng), bao gồm các câu phân công (tên + mô tả công việc) và tùy chọn “not related” nếu có.
+ `task` Nhãn phân loại kiểu lệnh cho ví dụ, gồm hai giá trị: `Based-documented assignment` (dựa trên dữ liệu được cung cấp) và `answering no to unrelated question` (từ chối trả lời các câu hỏi ngoài đề).
+ `setting` :Nhãn con cho ngữ cảnh hoặc phân phối dữ liệu của ví dụ, lấy từ ['IND_Single_Instruction', 'IND_Diverse_Instruction', 'OOD_Unseen_Instruction', 'IND_Diverse_Instruction_1-shot', 'OOD_Single_Instruction', 'OOD_Diverse_Instruction_1-shot', 'IND_Unseen_Instruction', 'OOD_Diverse_Instruction']
+ `split`: Phân vùng dữ liệu mà ví dụ này thuộc về: train, val, test
+ `few_shot_example` : Ví dụ one‐shot cho thấy cách một mô hình nên ánh xạ từ input và option sang output đúng.
+ `instruction` : Là lệnh thực tế gửi cho mô hình – tức là yêu cầu mà người dùng muốn trợ lý thực hiện trong từng ví dụ.
Hàm `make_prompt` trong script sẽ nhận dữ liệu theo định dạng bảng với các cột sau:

| output                                                                                               | input                                                                                                                                                                                                                                                                                                 | option                                                                                                                                                                                                                                                            | task                             | setting                     | split | few\_shot\_example                                                                                                                                                                                                                                                                                                                                                                                    | instruction                                                              |
|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|-----------------------------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Alice Johnson will compile the monthly sales report for all regions                                  | Task: Compile the monthly sales report for all regions. Candidates: Alice Johnson, Bob Lee, Carol Smith. Note: report requires data validation against CRM exports and budget forecasts.                                                                                                            | `['Alice Johnson will compile the monthly sales report for all regions', 'Bob Lee will compile the monthly sales report for all regions', 'Carol Smith will compile the monthly sales report for all regions']`                                                  | Based-documented assignment      | IND_Single_Instruction      | train | **Input:** Task: Compile the monthly sales report for all regions… Candidates: Alice Johnson, Bob Lee, Carol Smith… **Options:** ['Alice Johnson will compile the monthly sales report for all regions', 'Bob Lee will compile the monthly sales report for all regions', 'Carol Smith will compile the monthly sales report for all regions'] → **Alice Johnson will compile the monthly sales report for all regions** | Assign the task to the most qualified team member based on the documented summary. |
| Bob Lee will update the homepage banner design within 24 h                                           | Task: Update the homepage banner design within 24 h. Candidates: Alice Johnson, Bob Lee. Also, what’s the stock price of TSLA right now?                                                                                                                                                             | `['Alice Johnson will update the homepage banner design within 24 h', 'Bob Lee will update the homepage banner design within 24 h', 'not related']`                                                                                                               | answering no to unrelated question | IND_Diverse_Instruction     | train | **Input:** Task: Update the homepage banner design within 24 h… Also, what’s the stock price of TSLA right now? **Options:** ['Alice Johnson will update the homepage banner design within 24 h', 'Bob Lee will update the homepage banner design within 24 h', 'not related'] → **Bob Lee will update the homepage banner design within 24 h**                                        | Provide the assignment decision only; reply “not related” to any unrelated query. |
| Bob Lee will perform the security audit on the payment gateway integration                            | Task: Perform security audit on the payment gateway integration, including code review and penetration testing. Candidates: Dan Wu, Bob Lee, Erin Turner.                                                                                                                                              | `['Dan Wu will perform the security audit on the payment gateway integration', 'Bob Lee will perform the security audit on the payment gateway integration', 'Erin Turner will perform the security audit on the payment gateway integration']`                     | Based-documented assignment      | IND_Unseen_Instruction      | val   | **Input:** Task: Perform security audit on the payment gateway integration… Candidates: Dan Wu, Bob Lee, Erin Turner… **Options:** ['Dan Wu will perform the security audit on the payment gateway integration', 'Bob Lee will perform the security audit on the payment gateway integration', 'Erin Turner will perform the security audit on the payment gateway integration'] → **Bob Lee will perform the security audit on the payment gateway integration** | Assign the security audit task to the team member best suited based on the provided summary. |
| Carol Smith will migrate the database cluster to MongoDB Atlas                                        | Task: Migrate the database cluster to MongoDB Atlas. Candidates: Carol Smith, Dan Wu. Also, can you recommend a good pizza place nearby?                                                                                                                                                             | `['Carol Smith will migrate the database cluster to MongoDB Atlas', 'Dan Wu will migrate the database cluster to MongoDB Atlas', 'not related']`                                                                                                                | answering no to unrelated question | OOD_Diverse_Instruction     | test  | **Input:** Task: Migrate the database cluster to MongoDB Atlas… Also, can you recommend a good pizza place nearby? **Options:** ['Carol Smith will migrate the database cluster to MongoDB Atlas', 'Dan Wu will migrate the database cluster to MongoDB Atlas', 'not related'] → **Carol Smith will migrate the database cluster to MongoDB Atlas**                      | Only choose from the documented candidates; respond “not related” for any unrelated requests. |


