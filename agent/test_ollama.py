from langchain_ollama import ChatOllama

def main()-> None:
    model = ChatOllama(model = "llama3.2:3b",temperature = 0,)
    response = model.invoke("Reply with Only this text: Ollama Connection Successful ")
    print(response.content)

if __name__ == "__main__":
    main()