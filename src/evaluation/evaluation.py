from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
import sys
from typing import Dict, Any

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

# Start a new chat session (history can be expanded if needed)
chat_session = model.start_chat(history=[])

# Define your question, teacher's answer, and student's answer
question = "What is the capital of France?"
teacher_answer = "The capital of France is Paris, which is known for its art, culture, and landmarks like the Eiffel Tower."
student_answer = "Paris is the capital of France."

# Construct a prompt that includes the question along with the teacher's and student's answers
prompt = (
    f"Question:\n{question}\n\n"
    f"Teacher's Answer:\n{teacher_answer}\n\n"
    f"Student's Answer:\n{student_answer}\n\n"
    "Please evaluate the student's answer by comparing it with the teacher's answer in the context of the question. "
    "Provide a rating on a scale of 0 (completely incorrect) to 10 (perfect match) along with a brief explanation of your rating."
)

# Send the prompt to the Gemini API and capture the response
response = chat_session.send_message(prompt)

# Print the evaluation result
print("Evaluation Response:")
print(response.text)

def evaluate_subjective(question: str, teacher_answer: str, student_answer: str) -> Dict[str, Any]:
    # Construct the evaluation prompt
    prompt = (
        f"Question:\n{question}\n\n"
        f"Teacher's Answer:\n{teacher_answer}\n\n"
        f"Student's Answer:\n{student_answer}\n\n"
        "Please evaluate the student's answer by comparing it with the teacher's answer in the context of the question. "
        "Provide a rating on a scale of 0 (completely incorrect) to 10 (perfect match) along with a brief explanation of your rating."
    )

    # Send the prompt to the Gemini API and capture the response
    response = chat_session.send_message(prompt)
    
    # Parse the response and extract score (you may need to adjust this based on the response format)
    # For now, returning a simple dict with the raw response
    return {
        'score': 0,  # You'll need to parse the actual score from response.text
        'feedback': response.text
    }

def evaluate_quiz(quiz_data: Dict[str, Any]) -> Dict[str, Any]:
    quiz = quiz_data['quiz']
    answers = quiz_data['answers']
    results = {
        'score': 0,
        'feedback': [],
        'plagiarism_scores': {}
    }
    
    total_points = 0
    earned_points = 0

    for question in quiz['questions']:
        question_id = question['id']
        student_answer = answers.get(question_id)
        
        if question['type'] == 'multiple_choice':
            # Handle objective questions
            if student_answer == question['correctAnswer']:
                earned_points += question['marks']
        else:
            # Handle subjective questions with AI evaluation
            eval_result = evaluate_subjective(
                question['question'],
                question['correctAnswer'],
                student_answer if student_answer else ""
            )
            earned_points += eval_result['score']
            results['feedback'].append({
                'question_id': question_id,
                'feedback': eval_result['feedback']
            })
            
            # Run plagiarism check
            plagiarism_score = check_plagiarism(student_answer)
            results['plagiarism_scores'][question_id] = plagiarism_score
            
        total_points += question['marks']
    
    results['score'] = (earned_points / total_points) * 100 if total_points > 0 else 0
    return results

def check_plagiarism(student_answer: str) -> float:
    if not student_answer:
        return 0.0
        
    # Create a new chat session for plagiarism check
    plagiarism_prompt = (
        f"Analyze this answer for potential plagiarism indicators:\n{student_answer}\n\n"
        "Rate the likelihood of plagiarism on a scale of 0.0 to 10.0, "
        "where 0 means completely original and 10 means likely plagiarized. "
        "Return only the numeric score."
    )
    
    try:
        response = chat_session.send_message(plagiarism_prompt)
        # Extract numeric score from response
        score = float(response.text.strip())
        return min(max(score, 0.0), 10.0)  # Ensure score is between 0 and 10
    except:
        return 0.0  # Default to 0 if scoring fails

if __name__ == '__main__':
    quiz_data = json.loads(os.environ.get('QUIZ_DATA', '{}'))
    results = evaluate_quiz(quiz_data)
    print(json.dumps(results))
