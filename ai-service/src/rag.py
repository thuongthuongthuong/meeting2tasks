import torch
import torch.nn as nn
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
import os
from dotenv import load_dotenv

base_model = SentenceTransformer('all-MiniLM-L6-v2')

class LinearAdapter(nn.Module):
    def __init__(self, input_dim, adapter_dim=384):
        super().__init__()
        self.linear = nn.Linear(input_dim, adapter_dim)

    def forward(self, x):
        return self.linear(x)

adapter_checkpoint_path = 'linear_adapter_1epoch.pth'
saved = torch.load(adapter_checkpoint_path, map_location=torch.device("cpu"))

adapter_input_dim = saved['adapter_kwargs'].get('input_dim', 384)
adapter_dim = saved['adapter_kwargs'].get('adapter_dim', 384)

adapter = LinearAdapter(input_dim=adapter_input_dim, adapter_dim=adapter_dim)
adapter.load_state_dict(saved['adapter_state_dict'])
adapter.eval()


load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "jipt"

pc = Pinecone(api_key=PINECONE_API_KEY)

index = pc.Index(INDEX_NAME)

def upsert_with_base_model(texts, ids):
    base_embeddings = base_model.encode(texts, convert_to_numpy=True)
    vectors = list(zip(ids, base_embeddings.tolist()))
    index.upsert(vectors=vectors)
    print(f"Upserted {len(vectors)} base vectors.")

def query_with_adapter(text, top_k=5):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    adapter.to(device)

    base_vec = base_model.encode([text], convert_to_tensor=True).to(device)
    with torch.no_grad():
        adapted_vec = adapter(base_vec).cpu().numpy()[0]
    result = index.query(vector=adapted_vec.tolist(), top_k=top_k, include_metadata=True)
    return result


if __name__ == "__main__":
    texts = ["how to bake a cake", "learn python programming", "exploring the galaxy"]
    ids = ["doc1", "doc2", "doc3"]

    upsert_with_base_model(texts, ids)

    print("\nQuery: 'python code tutorial'")
    res = query_with_adapter("python code tutorial")
    for match in res["matches"]:
        print(f"ID: {match['id']} | Score: {match['score']:.4f}")
