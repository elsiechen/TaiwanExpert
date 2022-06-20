document.addEventListener('DOMContentLoaded', function(){
    // reward.html
    add_btns = document.querySelectorAll('.add_button');
    add_btns.forEach(function(add_btn) {
      add_btn.addEventListener('click', function() {
        item_id = this.dataset.addid;
        // Fetch answers and questions of this report
        fetch(`/add_reward/${item_id}`, {
          method: 'POST',
          headers: {
            'X-CSRFToken': getCookie('csrftoken')
          },
        })
        .then(response => response.json())
        .then(result => {  
          console.log(result);
          obj = result.obj;
          item = result.item;
          message = result.message;
          // Hide reward_item in menu which has been added
          if (item){
            menu = document.querySelector(`div[data-menuid="${item_id}"]`);
            menu.style.display = "none";
          }
          // Hide no_reward message if exist
          no_reward = document.querySelector("#no_reward");
          if (no_reward !== null){
            no_reward.style.display = "none";
          }
          
          // Show message at the end of MyReward
          message_view = document.querySelector("#message");
          message_view.innerHTML = message;
          // Update points and time
          remaining_points = document.querySelector("#remaining_points");
          remaining_points.innerHTML = `Remaining Points: <strong>${ obj[0].points }</strong>&nbsp;&nbsp;&nbsp;`;
          update_time = document.querySelector("#update_time");
          update_time.innerHTML = `Updated: ${ obj[0].updated_time }`;
          // Add reward item to MyReward
          MEDIA_URL="/media/"
          reward_view = document.querySelector("#reward_view");
          div = document.createElement('div');
          div.className = "col-sm-3"
          div.innerHTML = `
              <div class="card" style="max-width:250px; max-height: 500px;"> 
                  <img class="card-img-top" src='${ MEDIA_URL }${ item[0].image }' alt="Card image" style="width:250px; height:150px;">
                  <br>
                  <div class="card-text margins">
                    <span style="font-size: medium; font-weight: 500;">${ item[0].name }</span>
                  </div>
                  <div class="card-text margins">
                      <span style="font-size: medium;">Points Required:&nbsp;<strong>${ item[0].points }</strong></span>  
                  </div>
                  <br>
              </div>    
          `;
          reward_view.appendChild(div);
        });
      });
    });
    // history.html
    details_btns = document.querySelectorAll('.details_btn');
    close_btns = document.querySelectorAll('.close_btn');
    // Press show detail btn to show details_view and close itself
    details_btns.forEach(function(details_btn) {
      details_btn.addEventListener('click', function() {
        item_id = this.dataset.detailsid;
        detail_view = document.querySelector(`div[data-detailsview="${item_id}"]`);
        detail_view.style.display = 'block';
        details_btn.style.display = "none";
        // Fetch answers and questions of this report
        fetch(`/get_details/${item_id}`, {
          method: 'POST',
          headers: {
            'X-CSRFToken': getCookie('csrftoken')
          },
        })
        .then(response => response.json())
        .then(result => {  
          console.log(result.status);
          console.log(result.answers);
          console.log(result.questions); 
          qs_array = result.questions;
          items = result.answers;

          for (let i=0; i<items.length; i++){
            // Convert option to text
            if (items[i].content == 'Option1'){
              your_ans = qs_array[i].option1;
            }
            if (items[i].content == 'Option2'){
              your_ans = qs_array[i].option2;
            }
            if (items[i].content == 'Option3'){
              your_ans = qs_array[i].option3;
            }
            if (qs_array[i].answer == 'Option1'){
              correct_ans = qs_array[i].option1;
            }
            if (qs_array[i].answer == 'Option2'){
              correct_ans = qs_array[i].option2;
            }
            if (qs_array[i].answer == 'Option3'){
              correct_ans = qs_array[i].option3;
            }
            // Insert information to report view
            content = document.createElement('div');
            content.className = "card-text bold";
            content.innerHTML = qs_array[i].content;
            detail_view.appendChild(content);

            answer = document.createElement('div');
            answer.className = "card-text";
            answer.innerHTML = `Your answer: ${your_ans}`;
            detail_view.appendChild(answer);

            correct = document.createElement('p');
            correct.className = `${ items[i].correct ? 'correct' : 'false'}`;
            correct.innerHTML = `${ items[i].correct ? 'Correct' : 'Incorrect&nbsp;&nbsp;Answer:&nbsp;'+ correct_ans}`;
            detail_view.appendChild(correct);     
          }
        });
      });
    });
    // Press close btn to show detail btn and close details_view
    close_btns.forEach(function(close_btn) {
      close_btn.addEventListener('click', function() {
        item_id = this.dataset.closeid;
        detail_btn = document.querySelector(`button[data-detailsid="${item_id}"]`);
        detail_btn.style.display = 'block';
        detail_view = document.querySelector(`div[data-detailsview="${item_id}"]`);
        detail_view.style.display = 'none';
      });
    });



    // quiz.html
    start_view = document.querySelector('#start_view')
    quiz_view = document.querySelector('#quiz_view')
    report_view = document.querySelector('#report_view');
    
    start_view.style.display= "block";
    quiz_view.style.display= "none";
    report_view.style.display= "none";
    
    // Close start_view and open quiz_view
    start_btn = document.querySelector('#start_btn')
    start_btn.addEventListener('click', function(){
        // Clear localstorage data
        if (localStorage.getItem('id_ans')){
          localStorage.clear();
        }

        start_view.style.display= "none";
        quiz_view.style.display= "block";

        // Fetch array of questions, shuffle it, display them one after another in quiz
        q_array = range(1, 11)
        console.log(q_array)
        // Get first question from array
        fetch('/get_questions', {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
              q_array: q_array
            }),
          })
          .then(response => response.json())
          .then(result => {           
            quiz = document.querySelector('#quiz')
            qs_array = shuffle(result.questions);
            console.log(qs_array)
            console.log(typeof qs_array)
            current_q = 0;
            
            function showQuestion(){
              // From second question, clean-up any event listeners associated to the DOM before replacing the content or there will be memory leaks
              if (current_q > 0){
                removeHandler();
              }           

              question = qs_array[current_q];
              isLastQuestion = current_q === qs_array.length-1;

              quiz.innerHTML = `
                <div class="card-text"><b>${question.content}</b></div>
                <div class="card-text wrapper-class">
                  <input type="radio" id="opt1" name="option" value="Option1">
                  <label for="opt1">${question.option1}</label>
                </div>
                <div class="card-text wrapper-class">
                  <input type="radio" id="opt2" name="option" value="Option2">
                  <label for="opt2">${question.option2}</label>
                </div>
                <div class="card-text wrapper-class">
                  <input type="radio" id="opt3" name="option" value="Option3">
                  <label for="opt3">${question.option3}</label>
                </div>
                <br>
                <div class="card-text">
                  <button type="button" id="next_btn" class="sub_btn btn btn-primary margin-buttom">${!isLastQuestion ? 'Next' : 'Finish'}</button>
                </div>
                <br>
                <p id="message"></p>
                <br>
              `;

              addHandler();
            }

            function removeHandler(){
              quiz.querySelector('#next_btn').removeEventListener("click", handleNext);            
            }

            function addHandler(){
              quiz.querySelector('#next_btn').addEventListener("click", handleNext);           
            }

            function handleNext(){
              message = document.querySelector('#message');
              // If user didn't select any option, throw error and return
              if (document.querySelector('input[name="option"]:checked') === null) {
                message.innerHTML = "Please select an answer!"
                return; // Exit from function.
              }

              // Save question id and answer to localstorage
              q_id = qs_array[current_q].id;
              q_content = qs_array[current_q].content;
              q_selected = document.querySelector('input[name="option"]:checked').value;
              console.log(q_selected)
              q_answer = qs_array[current_q].answer;
              console.log(q_answer)
              if (q_selected == q_answer){
                q_correct = true;
              } else {
                q_correct = false;
              }
              answer = {id: q_id, 
                        content: q_content, 
                        selected: q_selected, 
                        answer: q_answer,
                        correct: q_correct}
              console.log(answer);

                // First question, localstorage setitem
              if (current_q == '0'){
                  ans_array = [answer]
                  localStorage.setItem('id_ans', JSON.stringify(ans_array));
                
              } else { // Questions except first one, retrieve items from localstorage, update items, and push updated items to localstorage
                items = JSON.parse(localStorage.getItem('id_ans'));
                items.push(answer);
                localStorage.setItem('id_ans', JSON.stringify(items));
              }
              console.log(JSON.parse(localStorage.getItem('id_ans')))

              // Not last question
              if (current_q < q_array.length-1){
                current_q++;
                showQuestion();
              } else { // Last question, report, save to database
                message.innerHTML ='You have reached the last question!';
                report();
                save();
                // Stop timer
                clearInterval(timer);
              }

            }
            
            function report(){
              quiz_view.style.display= "none";
              report_view.style.display= "block";
              
              items = JSON.parse(localStorage.getItem('id_ans'));
              console.log(items);
              // If no question was answered
              if (items == null){
                reports = document.querySelector('#reports');
                message = document.createElement('p');
                message.className = "report";
                message.innerHTML = "You did not answer any questions!"
                reports.appendChild(message); 
              } else { 
                  // Count points(number of correct*10)
                  points = 0;
                  for(let i=0; i<items.length; i++){
                    if (items[i].correct == true){
                      points = points + 10;
                    }
                  }

                  reports = document.querySelector('#reports');
                  poin = document.createElement('p');
                  poin.className = "poin";
                  poin.innerHTML = `You've got ${points} point(s)!`;
                  reports.appendChild(poin);
                  for (let i=0; i<items.length; i++){
                    // Convert option to text
                    if (items[i].selected == 'Option1'){
                      selected = qs_array[i].option1;
                    }
                    if (items[i].selected == 'Option2'){
                      selected = qs_array[i].option2;
                    }
                    if (items[i].selected == 'Option3'){
                      selected = qs_array[i].option3;
                    }
                    if (items[i].answer == 'Option1'){
                      correct_ans = qs_array[i].option1;
                    }
                    if (items[i].answer == 'Option2'){
                      correct_ans = qs_array[i].option2;
                    }
                    if (items[i].answer == 'Option3'){
                      correct_ans = qs_array[i].option3;
                    }
                    // Insert information to report view
                    content = document.createElement('div');
                    content.className = "card-text";
                    content.innerHTML = items[i].content;
                    reports.appendChild(content);

                    answer = document.createElement('div');
                    answer.className = "card-text";
                    answer.innerHTML = `Your answer: ${selected}`;
                    reports.appendChild(answer);

                    correct = document.createElement('p');
                    correct.className = `${ items[i].correct ? 'correct' : 'false'}`;
                    correct.innerHTML = `${ items[i].correct ? 'Correct' : 'Incorrect&nbsp;&nbsp;Answer:&nbsp;'+ correct_ans}`;
                    reports.appendChild(correct);     
                  }
                    
 
                }
               
            }

            function save(){
              q_items = JSON.parse(localStorage.getItem('id_ans'));
              console.log(q_items);
              console.log(typeof q_items);
              fetch('/save_questions', {
                method: 'POST',
                headers: {
                  'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                                      items: q_items
                                    }),
              })
              .then(response => response.json())
              .then(result => {
                console.log(result)
              });
            }
            

            // Timer
            timeleft = 1*15;
            timer = setInterval(function(){           
                min = Math.floor(timeleft / 60);
                sec = Math.floor(timeleft % 60);
                if (sec.toString().length == 2){
                    document.querySelector('#timer_view').innerHTML = "0" + min + ":" + sec;      
                } else {
                    document.querySelector('#timer_view').innerHTML = "0" + min + ":" + "0" + sec;      
                }    
                timeleft -= 1;
                if (timeleft < 0) {
                    clearInterval(timer);
                    message.innerHTML ='You have reached the last question!';
                    report();
                    items = JSON.parse(localStorage.getItem('id_ans'));
                    if (items !== null){ // Save if there is any answered question
                      save();
                    }  // If no question was answered
                    
                }
            }, 1000);

            showQuestion();
          });

    });
    
    
});




function range(start, end) {
    var array = []
    for (let i=start; i<(end-start+1); i++){
        array.push(i);
    }
    return array;
  }

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {       
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));               
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }        
    return array;
 }

function getCookie(cname) {
    // Create a variable with the cname to search for
    let name = cname + "=";
    // Decode the cookie string, to handle cookies with special characters
    let decodedCookie = decodeURIComponent(document.cookie);
    // Split document.cookie on semicolons into an array called ca
    let ca = decodedCookie.split(';');
    // Loop through the ca array, and get each value c = ca[i]).
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      // If the cookie is found (c.indexOf(name) == 0), return the value of the cookie (c.substring(name.length, c.length).
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    // If the cookie is not found, return ""
    return "";
  }