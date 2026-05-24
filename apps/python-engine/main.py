import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import AsyncOpenAI
# Import định nghĩa kiểu dữ liệu chuẩn cho mảng hội thoại của OpenAI
from openai.types.chat import ChatCompletionMessageParam

app = FastAPI(title="AIDevStudio Python Engine")

# Khởi tạo AsyncOpenAI Client
client = AsyncOpenAI(
    base_url=os.getenv("LLM_BASE_URL", "http://localhost:11434/v1"),
    api_key=os.getenv("LLM_API_KEY", "ollama")
)

MODEL_NAME = os.getenv("LLM_MODEL", "qwen2.5-coder:latest")

class ChatRequest(BaseModel):
    prompt: str
    context_files: list

def load_system_prompt(role: str = "coder") -> str:
    """Đọc prompt hệ thống từ thư mục cấu hình nằm ngoài project root."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    prompt_path = os.path.join(base_dir, "storage", "prompts", f"{role}.md")
    
    if not os.path.exists(prompt_path):
        return "You are an expert software engineer. Help the user modify project code safely."
        
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return "You are an expert software engineer. Help the user modify project code safely."

def construct_user_message(user_prompt: str, context_files: list) -> str:
    """Gộp câu hỏi của người dùng và nội dung các file liên quan thành một chuỗi ngữ cảnh."""
    message = "Below is the context of the files current open or relevant to the project:\n\n"
    
    for file in context_files:
        name = file.get("file_name", "Unknown File")
        content = file.get("content", "")
        message += f"--- START OF FILE: {name} ---\n{content}\n--- END OF FILE: {name} ---\n\n"
        
    message += f"User Request:\n{user_prompt}"
    return message

@app.post("/api/chat")
async def handle_chat(request: ChatRequest):
    try:
        # 1. Lấy Prompt hệ thống
        system_prompt = load_system_prompt("coder")
        
        # 2. Xây dựng nội dung tin nhắn người dùng
        user_content = construct_user_message(request.prompt, request.context_files)
        
        # 3. Khai báo kiểu dữ liệu ChatCompletionMessageParam một cách tường minh để thỏa mãn Pylance
        messages: list[ChatCompletionMessageParam] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]
        
        # 4. Hàm sinh dữ liệu (Generator) để Stream kết quả trả về
        async def response_stream():
            try:
                # Lúc này Pylance sẽ so khớp thành công tham số messages
                response = await client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=messages,
                    stream=True
                )
                async for chunk in response:
                    content = chunk.choices[0].delta.content
                    if content:
                        yield content
            except Exception as stream_err:
                yield f"\n[Engine Error during streaming: {str(stream_err)}]"

        return StreamingResponse(response_stream(), media_type="text/event-stream")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)