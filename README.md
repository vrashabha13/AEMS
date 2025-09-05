# AEMS - Advanced Examination Management System

---
## Functions
### Admin
- Create Admin account using command
```
py manage.py createsuperuser
```
- After Login, can see Total Number Of Student, Teacher, Course, Questions are there in system on Dashboard.
- Can View, Update, Delete, Approve Teacher.
- Can View, Update, Delete Student.
- Can Also See Student Marks.
- Can Add, View, Delete Course/Exams.
- Can Add Questions To Respective Courses With Options, Correct Answer, And Marks.
- Can View And Delete Questions Too.

### Teacher
- Apply for job in System. Then Login (Approval required by system admin, Then only teacher can login).
- After Login, can see Total Number Of Student, Course, Questions are there in system on Dashboard.
- Can Add, View, Delete Course/Exams.
- Can Add Questions To Respective Courses With Options, Correct Answer, And Marks.
- Can View And Delete Questions Too.
> **_NOTE:_**  Basically Admin Will Hire Teachers To Manage Courses and Questions.

### Student
- Create account (No Approval Required By Admin, Can Login After Signup)
- After Login, Can See How Many Courses/Exam And Questions Are There In System On Dashboard.
- Can Give Exam Any Time, There Is No Limit On Number Of Attempt.
- Can View Marks Of Each Attempt Of Each Exam.
- Question Pattern Is MCQ With 4 Options And 1 Correct Answer.
---

## HOW TO RUN THIS PROJECT
- Install Python(3.7.6) (Dont Forget to Tick Add to Path while installing Python)
- Open Terminal and Execute Following Commands :
```
python -m pip install -r requirements.txt
```
- Download This Project Zip Folder and Extract it
- Move to project folder in Terminal. Then run following Commands :
```
py manage.py makemigrations
py manage.py migrate
py manage.py runserver
```
- Now enter following URL in Your Browser Installed On Your Pc
```
http://127.0.0.1:8000/
```

## Screenshots

![admin dashboard](./images/admin%20dashboard.png)
*Admin dashboard — overview of users, stats and quick actions.*

![admin login page](./images/admin%20login%20page.png)
*Admin login page — secure sign-in for administrators.*

&nbsp;

![exam instructions](./images/exam%20instructions.png)
*Exam instructions — rules and time limits shown before starting the test.*

&nbsp;

![Home page](./images/Home%20page.png)
*Home page — landing page with navigation to courses & exams.*

&nbsp;

![student dashboard](./images/student%20dashboard.png)
*Student dashboard — shows current exams, progress and scores.*

![student login page](./images/student%20login%20page.png)
*Student login page — login and password recovery options.*

![student taking examination](./images/student%20taking%20examination.png)
*Exam interface — question view with timer and navigation.*

&nbsp;

![teacher adding question](./images/teacher%20adding%20question.png)
*Teacher add-question — form to create MCQ/subjective questions.*

![teacher dashboard](./images/teacher%20dashboard.png)
*Teacher dashboard — classes, assignments and grading tools.*

![teacher login page](./images/teacher%20login%20page.png)
*Teacher login page — secure access for instructors.*

**License**
This project is open-source under the MIT License.

**Author**
Developed by Saahil A Vishwakarma and Vrashabha Nilajagi.
