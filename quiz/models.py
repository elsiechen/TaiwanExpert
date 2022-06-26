from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

class Question(models.Model):
    ANSWER_CHOICES = (
        ('Option1', 'Option1'),
        ('Option2','Option2'),
        ('Option3','Option3')
    )
    content = models.CharField(max_length=300)
    option1 = models.CharField(max_length=300)
    option2 = models.CharField(max_length=300)
    option3 = models.CharField(max_length=300)
    answer = models.CharField(max_length=300, choices = ANSWER_CHOICES)

    def __str__(self):
        return f"Question: {self.content}"

class Answer(models.Model):
    ANSWER_CHOICES = (
        ('Option1', 'Option1'),
        ('Option2','Option2'),
        ('Option3','Option3')
    )
    user = models.ForeignKey(User, related_name="answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    content = models.CharField(max_length=300, choices = ANSWER_CHOICES)
    correct = models.BooleanField(default="False")
    
    def __str__(self):
        return f"Question:{self.question}; Your Answer:{self.content}; Correct:{self.correct}"

class Report(models.Model):
    user = models.ForeignKey(User, related_name="reports", on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    answers = models.ManyToManyField("Answer", related_name="reports", blank=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return f"User: {self.user}-Questions: {self.answers}"

    def get_points(self):
        report_item = Report.objects.get(id=self.id)
        answers_items = report_item.answers.all()
        print(answers_items)
        print(type(answers_items))
        points = 0
        for i in answers_items:
            if i.correct == True:
                points += 10
        print(points)
        return points

class RewardMenu(models.Model):
    name = models.CharField(max_length=300)
    description = models.CharField(max_length=500)
    image = models.ImageField(upload_to='media/images/')
    points = models.IntegerField()

    def __str__(self):
        return f"Reward: {self.name}-Points: {self.points}"

class MyReward(models.Model):
    user = models.ForeignKey(User, related_name="myrewards", on_delete=models.CASCADE)
    rewards = models.ManyToManyField(RewardMenu, related_name="myrewards", blank=True)
    points = models.IntegerField(default=0)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User: {self.user}-Points: {self.points}-Rewards:{self.rewards}"
