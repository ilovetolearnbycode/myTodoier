// on loading the document
const bible_verses = 
[
	{month : 'Jan',verse : 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.',ref:'2 Corinthians 5:17',url:'./images/jan.jpg'},
	{month : 'Feb',verse : 'By this we know love, that he laid down his life for us, and we ought to lay down our lives for the brothers.',ref:'1 John 3:16',url:'./images/feb.jpg'},
	{month : 'Mar',verse : 'As for me, I would seek God, and to God would I commit my cause,who does great things and unsearchable, marvelous things without number',url:'./images/mar.jpg'},
	{month : 'Apr',verse : 'so shall my word be that goes out from my mouth; it shall not return to me empty, but it shall accomplish that which I purpose, and shall succeed in the thing for which I sent it.',ref:'Isaiah 55:10',url:'./images/apr.jpg'},
	{month : 'May',verse : 'Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness and rivers in the desert.',ref:'Isaiah 43:19',url:'./images/may.jpg'},
	{month : 'Jun',verse : 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.',ref:'Proverbs 3:5 ',url:'./images/jun.jpg'},
	{month : 'Jul',verse : 'My flesh and my heart may fail, but God is the strength of my heart and my portion forever.',ref:'Psalm 73:26',url:'./images/jul.jpg'},
	{month : 'Aug',verse : 'Your word is a lamp to my feet and a light to my path.',ref:'Psalm 119:105',url:'./images/aug.jpg'},
	{month : 'Sep',verse : 'He who supplies seed to the sower and bread for food will supply and multiply your seed for sowing and increase the harvest of your righteousness.',ref:'2 Corinthians 9:10',url:'./images/sep.jpg'},
	{month : 'October',verse : 'The LORD is on my side; I will not fear. What can man do to me?',ref:'Psalm 118:6',url:'./images/oct.jpg'},
	{month : 'November',verse : 'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',ref:'1 Thessalonians 5:16,17,18',url:'./images/nov.jpg'},
	{month : 'December',verse : 'For unto you is born this day in the city of David a Savior, who is Christ the Lord.',ref:'Luke 2:11',url:'./images/dec.jpg'}
];
$(document).ready(function(){
	let date = new Date().toDateString().split(" ");
	let day = date[0];
	let month = date[1];
	let dateStr = date[2];
	let year = date[3];
	let displayDateString = `${dateStr} ${month} ${year}`;
	// setting this date string to the dom!
	$(".day").html(day);
	$(".date").html(displayDateString);

	// setting the header dynamically client side!
	bible_verses.forEach(bibleVerseObj=>{
		if(bibleVerseObj.month === month){
			$(".bible-verse").html(bibleVerseObj.verse);
			$(".bible-reference").html(bibleVerseObj.ref);
			$("header").css({
				"background":`url(${bibleVerseObj.url})`,
				"background-position":"center",
				"background-size":"cover",
				"background-repeat":"no-repeat"
			});
		};
	});
	let todos =  [];
	fetch("/getallTodos")
	.then(response=>response.json())
	.then(data=>{
		if(data){
			todos = data;
			let ids = [];
			todos.forEach(todo=>{
				setTodotoDom(todo);
				ids.push(todo._id);
			});
				deleteTodo();
				completedTodo();
		}else{
			console.log("error in the server try again later!");
		}
	});
});










$("#submit").click(function(){
	let todo = $("#add").val();
	let data = {};
	if(todo.length !== 0){
		data = {
			todo,
			state:false,
		};
	}
	
	const options = {
		method:'POST',
		headers:{
			'Content-Type':'application/json',
		},
		body:JSON.stringify({data})
	};
	fetch('/sendData',options)
	.then(response=>response.json())
	.then(data=>{
		if(data){
			setTodotoDom(data);
			deleteTodo();
			completedTodo();
		}else{
			console.log("error received!@");
		}
	});
	$("#add").val("");
});



function setTodotoDom(data){
	let ul = document.querySelector(".todoList");
	let li = document.createElement("li");
	let p = document.createElement("p");
	p.classList.add("todo-content");

	let stateP = document.createElement("p");
	
	stateP.textContent = data.data.state + ":" + data._id;

	stateP.classList.add("hideMe");
	if(stateP.textContent.split(":")[0] === "true"){
		p.style.color = "#ccc";
		p.style.textDecoration = "line-through";
	}else{
		p.style.color = "#fff";
		p.style.textDecoration = "none";
	}

	p.textContent = data.data.todo;


	let div = document.createElement("div");
	let span1 = document.createElement("span");
	span1.classList.add("delete");
	let span2 = document.createElement("span");
	span2.classList.add("complete");
	span1.innerHTML = `<span class="material-icons">
								delete_outline
						</span>`;
	span2.innerHTML = `<span class="material-icons">
								check_circle_outline
						</span>`;

	div.append(span1,span2);

	li.append(p,stateP,div);
	ul.appendChild(li);
}

function deleteTodo(){
	let deleteBtns = document.querySelectorAll(".delete");
	let completeBtns = document.querySelectorAll(".complete");

	for(let i = 0;i<deleteBtns.length;i++){
		deleteBtns[i].addEventListener("click",e=>{
			e.preventDefault();
			let targetElements = e.target.parentElement.parentElement.parentElement.children[1].textContent.split(":");
			let id = targetElements[1];
			const options = {
				method:'POST',
				headers:{
					'Content-Type':"application/json",
				},
				body:JSON.stringify({
					id : id
				})
			};
			fetch("/deleteTodo",options)
			.then(response=>response.json())
			.then(data=>{
				if(data){
					window.location.reload();
				}
			});
		});
	}
}



function completedTodo(){
	let completedBtns = document.querySelectorAll(".complete");
	let lis = document.querySelectorAll("li");
	for(let i = 0;i<completedBtns.length;i++){
		completedBtns[i].addEventListener("click",e=>{
			e.preventDefault();
			let hiddenText = lis[i].children[1].textContent;
			let state = hiddenText.split(":")[0];
			let id = hiddenText.split(":")[1];
			// getting the current state of the todo!
			if(state === "false"){
				state = true;
			}else if(state === "true"){
				state = false;
			}else {
				state = false;
			}

			// sending this data to server to set the changed state in the database!;
			const options = {
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Accept':"application/json"
				},
				body:JSON.stringify({
					state,id
				})
			};

			fetch("/updateTodo",options)
			.then(response=>{
				if(response.status === 200){
					fetch('/getallTodos')
					.then(res=>res.json())
					.then(data=>{
						document.querySelector(".todoList").innerHTML = "";
						for(let i = 0;i<data.length;i++){
							setTodotoDom(data[i]);
						}
						window.location.reload();
					});
				}else{
					console.log("Error updating in the database!");
				}
			})
		});
	}
}










