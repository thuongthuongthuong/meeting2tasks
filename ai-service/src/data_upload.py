from pymongo import MongoClient
from bson.objectid import ObjectId
from rag import base_model, index  # Ensure base_model and index are available from rag.py
from utils import calculate_time_interval

def upload_mongodb_to_pinecone(
    mongo_uri = "mongodb://localhost:27017",
    db_name="meeting2tasks",
    collection_name="projects",
    batch_size=100
):
    # Connect to MongoDB
    client = MongoClient(mongo_uri)
    collection = client[db_name][collection_name]

    # Find documents with non-empty description fields
    cursor = collection.find({"description": {"$exists": True, "$ne": ""}})

    batch_texts = []
    batch_ids = []
    total = 0

    for doc in cursor:
        desc = doc["description"]
        doc_id = str(doc["id"]) 


        desc += " " + calculate_time_interval(
            doc["start_date"].isoformat(),
            doc["end_date"].isoformat()
        )

        # strip all the special characters
        desc = "".join(e for e in desc if e.isalnum() or e.isspace())

        batch_texts.append(desc)
        batch_ids.append(doc_id)
        total += 1

        if len(batch_texts) == batch_size:
            _upsert_batch(batch_texts, batch_ids)
            batch_texts, batch_ids = [], []

    if batch_texts:
        _upsert_batch(batch_texts, batch_ids)

    print(f"✅ Uploaded {total} descriptions to Pinecone.")

def _upsert_batch(texts, ids):
    embeddings = base_model.encode(texts, convert_to_numpy=True)
    vectors = [
        {
            "id": doc_id,
            "values": embedding.tolist(),
            "metadata": {"text": text}
        }
        for doc_id, text, embedding in zip(ids, texts, embeddings)
    ]
    index.upsert(vectors=vectors)

# === Example Usage ===
if __name__ == "__main__":
    upload_mongodb_to_pinecone()
