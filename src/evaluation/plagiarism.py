from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables from the custom .env file (api.env)
load_dotenv("api.env")

# Retrieve the GEMINI_API_KEY from the environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable in api.env.")

# Configure the Gemini API with your API key
genai.configure(api_key=GEMINI_API_KEY)

# Define the generation configuration parameters
generation_config = {
    "temperature": 0.7,             # Adjust for more or less creativity
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 512,       # Adjust token count as needed
    "response_mime_type": "text/plain",
}

# Create the model using the Gemini-2.0 flash variant
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

# Define the teacher's question and answer to provide context
teacher_question = "What is the capital of France?"
teacher_answer = ("The capital of France is Paris, known for its art, culture, and landmarks like the Eiffel Tower. "
                  "This answer provides details on what a complete answer should include.")

# List of student answers with their identifiers
students = [
    {"name": "Student A", "answer": "Paris is the capital of France."},
    {"name": "Student B", "answer": "The capital city of France is Paris, famous for the Eiffel Tower."},
    {"name": "Student C", "answer": "I believe the capital of France is Lyon."},
    # Add more student answers as needed...
]

# Evaluate plagiarism for each student relative to all other students
for target_student in students:
    # Prepare a list of all other students for comparison
    other_students = [s for s in students if s["name"] != target_student["name"]]

    # Construct the prompt with the teacher's context, the target student's answer,
    # and the answers from all other students.
    prompt = (
        f"Teacher's Question:\n{teacher_question}\n\n"
        f"Teacher's Answer:\n{teacher_answer}\n\n"
        f"Student under evaluation ({target_student['name']}) Answer:\n{target_student['answer']}\n\n"
        "Other Students' Answers:\n"
    )
    for other in other_students:
        prompt += f"{other['name']}: {other['answer']}\n"
    
    prompt += (
        "\nBased on the teacher's question and teacher's answer, evaluate the plagiarism level "
        "in the evaluated student's answer compared to the other students' answers. "
        "Provide a plagiarism score on a scale of 1 (no plagiarism) to 10 (definitely plagiarized), "
        "and include a brief explanation for your rating. "
        "Keep the response concise."
    )

    # Start a new chat session to ensure clean context and send the prompt
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(prompt)

    # Print the plagiarism evaluation for the current student
    print(f"Plagiarism evaluation for {target_student['name']}:")
    print(response.text)
    print("-" * 80)
