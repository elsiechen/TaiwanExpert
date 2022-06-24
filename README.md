
# Distinctiveness and Complexity
## Distinctiveness
This project, TaiwanExpert, is a quiz website, which contains 1) limited time of shuffled questions user can take several times, 2) the reports of all quizzes user has done, and 3) the reward mechanism through quiz points. The main purpose of this project is to encourage people to know more about Taiwan culturally. 

Users will know some interesting facts of Taiwan through quiz just like they are on the quiz show. Users will receive result of quiz just after submitting all questions or when time's up. To reward users, users can exchange earned points for icons of Taiwan's renowned civilian food.

The features above make this project distinct from Pizza project(shopping cart), social network(Project 4), or e-commerce(Project 2).

## Complexity
Within each quiz, questions are shuffled and only one question is rendered in each page. Users are required to press "Next" button to proceed to the next question and "Finish" button if users reached the final one. If none option is selected and user press "Next" or "Finish" button, error message will show up and unable to proceed. 

Users are required to answer questions in limited time using timer. If users submit all questions in a quiz, report including earned points will be presented immediately though the time isn't up; if only one or more questions are submitted, report including earned points will be presented when time is up; if none question are answered and time is up, users will be informed error message, and there will not be report including points.

The history page will show all reports of quizzes. With "show details" button and "close details" button to show and hide detailed information using JavaScript fetch to retrieve details without reloading the page.

In the reward page, reward items are limited and every item can only be exchanged once. If items are exchanged with the required points, the items will be removed from the menu list and added to users' MyReward list. If users have not earned any points, error message will show up; if users have not exchanged any reward, there will be message about no exchanged reward yet. If users exchange points for reward item successfully, message will refer to the name of the item; if users failed to exchange points for reward, message will show lack of points and refer to the name of the item.

The project is done using localStorage to store each answered questions and JavaScript fetch to store quiz results. In each template, users interact with webpage (get report of quiz, press "Next" button, "show details" button, "close details" button, "exchange" button) using JavaScript without reloading the page.

# What’s contained in each file
The project utilize Django on the back-end and JavaScript on the front-end, and is mobile-responsive.
## templates
### index.html
There is a brief explanation of this project and a "Go To Quiz" button to redirect users to the quiz page.

### quiz.html
This file includes explanation about the quiz like time limit and points earned, and a "Start Quiz" button to start the quiz, which are hidden after staring quiz. Quiz div tag, timer div tag, and report div tag are shown after starting quiz.

### history.html
This file includes history reports of all quiz a user has done, not include report in which no answer was submitted. In each report, it shows id of report, created time, username, points earned through quiz, and two buttons to show and close details of all questions and answers to the quiz.  

### reward.html
This file includes two parts, one is user's reward information, the other is reward items. 
In user's reward information, if user has not taken any quiz, message will remind user to give a try and show a link button; if user has taken quiz, username, remaining points, created time, and updated time will show up. Besides, if user has exchange points for reward items, the items will show up beneath remaining points, or message will show no reward item exchanged.
In reward items, items are limited to be exchanged once so reward items are either in the user's reward list or in the reward menu.

### layout.html
This contains base elements other templates share, in which head tag includes link tag to static files, meta tag to be mobile-responsive, meta tag to show character set this project is written with, script tags of bootstrap styling and JavaScript file; body tag includes elements in navigation bar which shows depends on user authentication.
### login.html
This file authenticates user's account name and password, redirect to index page if successful, throw error message if failed.
### register.html
This file create new user's account which bases on unique account name and match of password and confirmation. Errors will be thrown if there's already existed user name or two passwords not match.

## static
### quiz.js
Javascript files of different templates(quiz.html, history.html, reward.html) are combined in this file.

In quiz.html, when "Start Quiz" button was clicked, this templates will be replaced by shuffled questions JavaScript fetched and inserted into this file. During quiz, all answers will be stored temporarily in localStorage. After time's up or reach to the final question, report will show up, and answers will be sent to store in database through fetch.

In history.html, if "Show Details" button was clicked, JavaScript will fetch details of the specific quiz and insert them into template immediately; if "Close Details" buttons was clicked, details information will be hidden.

In reward.html, when "Exchange" button on a item is clicked, if user's remaining points is enough to exchange for the reward item, the item will be remove from menu and into user's reward list. JavaScript will send information to store this reward in database and show success message. Or message will show not enough points.

### styles.css
This file styles html files.
### tw.jfif
This is the background in index.html

## models.py
### User
### Question
This model store all available questions, which contains content of question, three options, and answers, all fields are CharField but answer field use CHOICES.
### Answer
This model stores users' each answer to the question, which contains user field(ForeignKey), question field(ForeignKey), users' selected option(CHOICES), and correct or not(BooleanField).
### Report
This model stores users' result of quiz, which contains user field(ForeignKey), created_time field, answers field(ManyToManyField to Answer model), points field(IntegerField).
### ReportMenu
This model stores all available rewards, which includes name field(CharField), description field(CharField), image field(ImageField), and points field(IntegerField).
### MyReward
This model stores users' reward information, which contains user field(ForeignKey), created_time field, updated_time field, points field(IntegerField), and rewards(ManyToManyField to RewardMenu model).

## requirement.txt
This shows packages that need to be installed in order to run my web application

## media/images
This directory contains all image of reward items.

## urls.py
This file includes paths to templates and interaction with JavaScript. 

## views.py
This file reders templates; implements create, read, update actions with database; communicates data with JavaScript. 

# How to run my application
1. install Django==1.11.11
2. run "python3 manage.py runserver" in terminal
