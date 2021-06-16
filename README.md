# The Space Invaders Project :space_invader:

[![Front End Tests Actions Status](https://github.com/AvshRLev/gamesproject/workflows/Front%20End%20Tests/badge.svg)](https://github.com/AvshRLev/gamesproject/actions) [![Lint Code Base Action Actions Status](https://github.com/AvshRLev/gamesproject/workflows/Lint%20Code%20Base%20Action/badge.svg)](https://github.com/AvshRLev/gamesproject/actions) [![Website space-invaders.avshi.net](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://space-invaders.avshi.net/)

This is my final project to Harvard's **CS50’s Web Programming with Python and JavaScript**.

It was created end to end by me for learning and showcasing my abilities.

Space Invaders was the first computer game I had ever played on my first computer with a black and green screen when I was a little boy and I tried to recreate it as I remembered It.

At the moment It has 4 different levels where you are the defending spaceship trying to shoot all the aliens as they are advancing towards the ground.

Time is counted and every alien you destroy gives you 10 points.

![Screenshot](/docs/screenshot.png)

It is written in Python with the Django Web framework with a PostgreSQL DB hosted on AWS's RDS and the front end is augmented with vanilla JavaScript.

I have chosen not to use a framework or library such as React or Angular for this project in order to build a strong foundation of the JavaScript language and a solid ability to control the DOM manually.

I do use the Node.js eco system for testing with Jest and Puppeteer and bundling with webpack.

To view the project online follow [this link](https://space-invaders.avshi.net "Link to my project online")

It is not mobile friendly yet so make sure to visit from a desktop or a laptop.

## Table of contents

1. [Project Architecture](#project-architecture)
2. [Deployment Architecture](#deployment-architecture)
3. [Deployment Pipeline](#deployment-pipeline)
4. [My Git Workflow](#my-git-workflow)
5. [Best Practices Learned](#best-practices-learned)
6. [Inspirations](#inspirations)
7. [Testing](#testing)
8. [General Workflow](#general-workflow)

## Project Architecture

Overview

![Project Architecture](/docs/Architecture.png)

Detailed

![Detailed Architecture](/docs/detailed-arch.png)

## Deployment Architecture

![Deployment Architecture](/docs/k8saws.png)

### How I Deployed Kubernetes On AWS

I used kubeadm to install kubernetes on 3 EC2 Instances a master and 2 workers. to a more in depth explanation and step by step guide you can follow [This Link](/docs/k8s.md)

## Deployment Pipeline

![CI/CD](/docs/ci-cd.png)

### Or even simpler

#### My CI

Push -> Test + Lint -> Pull Request -> Code Review -> Adress Comments -> Merge To Main

#### My CD

Merge To Main -> [Test](.github/workflows/test-run.yml) + [Lint](.github/workflows/super-linter.yml)
-> [Build and Push Docker Image](.github/workflows/docker.yml) -> [Kubernetes Redeploy](.github/workflows/deliver.yml)

#### Kubernetes Redeploy

In this action I Basically SSH into the EC2 Instance that is configured as my master node and run a script that triggers it to terminate the existing pods with this app and run new ones pulling the freshly pushed Docker Image.

## My Git Workflow

When I start working on a feature I start by checking out the main branch

```shell
git checkout main
```

Pull the most recent commit with

```shell
git pull
```

Then create a new branch for it with

```shell
git checkout -b new_branch_name
```

When my code reaches a state i would like to keep it's time to commit

```shell
git commit -am "Concise message to convey what happens in this commit"
```

The -a flag stages all files that have been modified and deleted, if new files were created they need to be added with

```shell
git add new_file.ext
```

Or I simply use my IDE to add them.

The -m flag is for adding the message in the same line without opening an editor.

If I want to commit in a state where things are not working and I will not want this commit in my history I will

```shell
git commit -am "f"
```

Letting myself know I will want to use the fixup option later when I rebase this branch interactively.

When it is time to push, On the first push of a new branch

```shell
git push --set-upstream origin new_branch
```

On consequent pushes it is enough to just `git push`

Before I push I check for commits with a message of "f" with

```shell
git log --oneline
```

In case there are such messages I will count the number of commits to the last commit that is not marked with "f"
For example if I have 5 commits to the last commit that is not marked with "f" like in this screenshot:

![Git Log](/docs/gitlog.png)

I will use an interactive rebase

```shell
git rebase -i HEAD~5
```

Which will open an editor as such:

![Git Rebase Editor](/docs/git-rebase.png)

In which I will change the pick in all the commits marked with "f" to f (stands for fixup)

![Git Rebase Fixup](/docs/git-rebase-fixup.png)

And after I exit the editor all the changes in these commits are kept in the commits that came before them that we picked so if we `$ git log --oneline` again we will get:

![Git Log After Rebase Interactive](/docs/git-log-after.png)

After an interactive rebase pushing has to forced in order to work

```shell
git push -f
```

Next when I have a pull request that is ready to be merged into main, before I do I will

```shell
git fetch
```

To make sure origin/main is up to date and then from the branch i want to merge

```shell
git rebase origin/main
```

In case of merge conflicts I solve them in my IDE and after I am done i know my branch is based off the latest commit to main and when merged my git history will be organized and clear.

## Best Practices Learned :mortar_board:

### Best practices and coding principles learned while working on this project

- #### Naming - names, names, names...

  Naming defines responsability.
  Once you start defining the responsibilities you tend to refactor your code to smaller cohesive units.

  It allows us to see what a method or a function is supposed to do and when we see something that does not belong there it will be easy to spot and fix.

  The names we give functions,class methods, variables, and also commit messages, branches and pull requests are all very important for our and other's ability to understand and maintain the code that we write.

- #### Refactoring and The Single Responsibility Principle

  After we have named and thus gave the different units of our code their responsibilities we make sure
  that every unit does one thing only.

  if a unit does more than one thing we break it down into smaller units and smaller until each one does one thing for which it is named.

  The advantage is that it is easier to understand, read, test and change our code this way.

- #### When should you write comments in code? What should it describe?

  Good code explains itself and does not need comments but if for some reason you find yourself with a piece of code that does not explain itself or is too complex, until you get the chance to refactor, Comments in code should explain why you chose to do something and not how you did it (the code itself should explain the how).

  We use comments when function names are not telling the whole story and there's a need to tell the meaning behind it.

- #### Command Query Separation Principle

  If asking a question changes the answer, we're likely to run into problems.

  CQS (Command-Query Separation) is a design principle that states that a method is either a COMMAND that performs an action (with side effects) OR a QUERY that returns data to the caller, but never both.

  Queries avoid mutations. It means that we make a separation between functions that return information and functions that perform some kind of action.

  By enforcing this separation, the code becomes simpler to understand. Is this changing something, or just fetching something? When a method does both (changes the state of the application and retrieves data), it becomes a lot harder to understand it's true purpose.

  And the main advantage is that we can safely and easily use our queries, In addition it makes our code easier to understand and maintain.

  Some of these sentences are quoted from [this website](https://khalilstemmler.com/articles/oop-design-principles/command-query-separation/) which is a great resource.

  [Also you can see this discussion in one of this repo's pull requests](https://github.com/AvshRLev/gamesproject/pull/4#discussion_r606762767)

- #### Pure Functions

  A pure function is a function that works on a given parameter and gives out an Output but does not change the original parameter.

  The advantage of it is that you don’t need to worry about side effects when you use pure functions because they have no side effects.

  Its important to note that pure function only manipulates the data it got as input to return an answer and does not get any data from hidden dependencies like a database or other objects for example.

  The biggest advantage of pure functions is that they are deterministic - you'll always get the same result for the same inputs and thats very easy to reason about.

- #### Declarative vs Imperative programming

  In declarative programming you declare what you are going to do (for example: .map() and .filter())

  In Imperative programming you simply do the things (for example: for loops )

  Simply put -> Declarative is the what, Imperative is the how

- #### When should a function be a class method?

  If a function has dependencies inside the class (i.e that it needs something specific from inside the class or that it works on specific things in that class) than it should be a class method.

- #### Why is code formatting and styling important?

  When you work in a team and have a huge codebase its much easier when all the code looks alike.

  Less cognitive pressure on your brain.

- #### Refactoring heavily nested if else statements

  Organizing the ifs one under the other in the order in which you want the conditions to be evaluated so if the first if is true all the others won’t need to be evaluated and use early returns to break out of them.

- #### Why you should not change parameters that are passed into a function?

  They are not the actual parameters but copies of them and if you pass the reference you might have side effects you did not expect.

- #### Why functions should never return null

  Returning null leads to the spread of null values and the need for verifications for null. Instead, try to use objects with default properties, or even throw errors.

  An interesting article about why you should _[Think Twice Before Returning null](https://odetocode.com/blogs/scott/archive/2019/08/07/think-twice-before-returning-null.aspx)_.

  Learn _[Everything about null in JavaScript](https://dmitripavlutin.com/javascript-null/)_ in this great article.

- #### The way I introduce new tech into my project

  - Start with a working "Hello World!" basic implementation of new tech
  - Implement the most basic "Hello World!" tutorial of new tech inside the project step by step (even copy line by line from the working example)
  - Implement the smallest most simple function inside the project with new tech
  - Grow from there

- #### The debugging state of mind

  The debugging state of mind entails having a cup of tea (Or a cool drink in the summer), your favorite relaxing concentration music on the earphones, deep breaths and some stretching so that you are relaxed and able to think clearly about things.

  Solving problems doesn’t happen in a stressed mind and body.

## Testing

The front end tests in this project are behaviour driven tests geared towards replacing the manual checks i would run after every change in the code base.

This is done using Jest and Puppeteer.

First of all, I make sure django is running and serving my app on localhost.

Then I open a headless chrome with puppeteer and programtically simulate the steps I would take to run each test or check each behaviour of the app manually.

I use Jest to assert the behaviour was indeed as expected.

Below are some screenshots from the test report i get after every time the testing action runs in GitHub

![Test Results](/docs/results1.png) ![Test Results](/docs/results2.png) ![Test Results](/docs/results3.png)

## General Workflow

I have had the joy and luck to find an amazing mentor who is also an old time friend... He has been training me and teaching me throughout this project.
We have been working in the Kanban method with a [trello board](https://trello.com/b/OX4xBjob/space-invadors)

![Trello](/docs/trello.png)

My mentor has been adding tasks to the backlog and I have been moving them between the different columns until they found their way to the Done column and so I could take a new one from the backlog.
