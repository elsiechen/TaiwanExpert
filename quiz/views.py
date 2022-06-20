from django.shortcuts import render
from django.contrib import messages 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from datetime import datetime
import datetime
from .models import User, Question, Answer, Report, RewardMenu, MyReward 
import json
import random
import time
from django.core import serializers


# Create your views here.
def index(request):
    return render(request, "quiz/index.html")

@login_required
def quiz_view(request):
    return render(request, "quiz/quiz.html")
       

@login_required
def get_questions(request):
    if request.method == "POST":
        data = json.loads(request.body)
        array = data.get("q_array")
        try:
            ### Pass a list of the values for that queryset to get array of objects in javascript
            qs = Question.objects.filter(id__in=array).values()
            print(qs) 
            print(type(qs))
        except Question.DoesNotExist:
            qs = None      
        return JsonResponse({"questions": list(qs)})


@login_required
def save_questions(request):
    if request.method == "POST":
        data = json.loads(request.body)
        array = data.get("items")
        print(f"array:{array}")
        current_user = User.objects.get(id=request.user.id)
        time = datetime.datetime.now()
        # Save information to Report model
        new_report = Report(
            user = current_user,
            created_time = time,
        ) 
        new_report.save()
        # Save items information to Answer model
        for i in array:
            q_id = i["id"]
            a_question = Question.objects.get(id=q_id)
            a_content = i["selected"]
            a_correct = i["correct"]
            new_answer = Answer(
                user = current_user,
                question = a_question,
                content = a_content,
                correct = a_correct
            )
            new_answer.save()
            print(f"new_answer:{new_answer}")
            # Save answer_id to manytomanyfield in Report model
            latest_answer = Answer.objects.latest('id')
            new_report.answers.add(latest_answer)
        print(f"new_report: {new_report}")
        # Save points to Repoert
        new_report.points = new_report.get_points()
        new_report.save()
        print(f"new_report: {new_report}")

        try: # Update information to MyReward model
            my_obj = MyReward.objects.get(user=current_user)
            old_points = my_obj.points
            print(f"old_points:{old_points}")
            updated_points = int(old_points + new_report.points)
            print(f"updated_points:{updated_points}")
            my_obj.points = updated_points
            my_obj.updated_time = time
            my_obj.save()
            print(f"my_obj:{my_obj}")
        except MyReward.DoesNotExist: # Create MyReward model if it doesn't exist
            new_reward = MyReward(
                user = current_user,
                points = new_report.points,
                created_time = time,
                updated_time = time,
            )
            new_reward.save()
            print(f"new_reward:{new_reward}")
        
        return JsonResponse({"status": "Save successfully!"})




@login_required
def history_view(request):
    current_user = User.objects.get(id=request.user.id)
    reports = Report.objects.filter(user=current_user).order_by("-id").all()
    
    return render(request, "quiz/history.html",{
        "reports": reports
    })


@login_required
def get_details(request, report_id):
    if request.method == "POST":
        try:
            report = Report.objects.get(id=report_id)
            print(f"report: {report}")
            answers = report.answers.all()
            ### Pass a list of the values for that queryset to get array of objects in javascript
            answers_values = report.answers.all().values()
            # Get all questions
            q_ids = []
            for i in answers:
                q_id = i.question.id # Get question id instead of queryset
                print(f"type: {type(q_id)}")
                q_ids.append(q_id)
            questions = Question.objects.filter(id__in=q_ids).all().values()
            print(f"answers: {answers}")
        except Report.DoesNotExist:
            report = None 
            
        return JsonResponse({"status": "Successfully get details!",
                             "answers": list(answers_values),
                             "questions": list(questions)
                            })


@login_required
def reward_view(request):
    current_user = User.objects.get(id=request.user.id)
    try:
        obj = MyReward.objects.get(user=current_user)
        print(f"obj: {obj}")
        array = obj.rewards.all()
        # Get all reward items
        r_ids = []
        for i in array:
            r_id = i.id 
            print(f"type: {type(r_id)}")
            r_ids.append(r_id)
        rewards = RewardMenu.objects.filter(id__in=r_ids).all()
        print(f"rewards: {rewards}")
        items = RewardMenu.objects.exclude(id__in=r_ids).all()
    except MyReward.DoesNotExist:
        obj = None 
        rewards = None
        items = RewardMenu.objects.all()
    return render(request, "quiz/reward.html",{
        "items": items,
        "obj": obj,
        "rewards": rewards
    })

@login_required
def add_reward(request, reward_id):
    if request.method == "POST":
        current_user = User.objects.get(id=request.user.id)
        try:
            obj = MyReward.objects.get(user=current_user)
            print(f"obj: {obj}")
            old_points = obj.points
            reward_item = RewardMenu.objects.get(id=reward_id)
            item_name = reward_item.name
            print(f"reward_item: {reward_item}")
            required_points = reward_item.points
            # Check if enough points to add item to MyReward
            if int(old_points) >= int(required_points):
                updated_points = int(old_points - required_points)
                obj.points = updated_points
                # Save reward_item to manytomanyfield in MyReward model
                obj.rewards.add(reward_item)
                obj.save()
                time = datetime.datetime.now()
                obj.updated_time = time
                obj.save()
                print(f"obj_updated: {obj}")
                message = "Successfully added&nbsp;" + item_name + "&nbsp;to MyRewards!"
                item_values= list(RewardMenu.objects.filter(id=reward_id).all().values())
                print(f"item_values: {item_values}")
            else:
                message = "Failed to add&nbsp;" + item_name + "&nbsp;to MyReward due to not enough points!"
                item_values = None
            obj_values = list(MyReward.objects.filter(user=current_user).all().values())
            print(f"obj_values: {obj_values}")
        except MyReward.DoesNotExist:
            obj = None 
            obj_values = None
            item_values = None
            message = "Unable to add reward item!"
        return JsonResponse({"status": "Success",
                            "message": message,
                             "obj": obj_values,
                             "item": item_values
                            })

     

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "quiz/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "quiz/login.html")


@login_required
def logout_view(request):
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "quiz/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "quiz/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "quiz/register.html")