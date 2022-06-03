var discussionsArray = []
var discussionsNode = document.getElementById('disc-area')
var respQuestion = document.getElementById('resp-question')
var respResponses = document.getElementById('resp-response')

const getAPI = () => {
  // var http = new XMLHttpRequest();
  // http.open('GET', `https://storage.codequotient.com/data/get`)
  // http.send()
  // http.addEventListener('load', (e)=>{
  //   var res = JSON.parse(e.target.responseText)
  //   console.log('got the data from server')
  //   discussionsArray = JSON.parse(res.data)
  //   discussionsArray.sort( (b,a) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes) )
  //   discussionsArray.sort( (a,b) => b.fav - a.fav )
  //   getDiscussions(discussionsArray)
  // })
}

//main function call
getAPI()

const saveAPI = (dataArray) => {
  // var http = new XMLHttpRequest();
  // http.open('POST', `https://storage.codequotient.com/data/save`)
  // http.setRequestHeader("Content-Type", "application/json");
  // http.send( JSON.stringify( { data: JSON.stringify(dataArray) } ) )
  // http.addEventListener('load', (e)=>{
  //   var res = JSON.parse(e.target.responseText)
  //   if(res.msg == 'Data saved successfully'){
  //     console.log('sent the data to server')
  //   }
  // })
}

const renderDiscussion = (disc) => {
  if(discussionsNode.innerHTML == '<p>No Discussions Found !</p>')
    discussionsNode.innerHTML = ''

  var dateTime = document.createElement('sub')
  dateTime.innerHTML = 'Created at: ' + new Date(disc.id).toLocaleString('in')

  var timeLapsed = document.createElement('sub')
  timeLapsed.innerHTML = ' , about ' + Math.floor((Date.now() - disc.id)/1000) + ' seconds ago...'

  var titleDiv = document.createElement('div')
  var subject = document.createElement('p')
  subject.innerHTML = disc.subject
  subject.classList.add('subject')
  var question = document.createElement('p')
  question.innerHTML = disc.question
  question.classList.add('sub-subject')
  titleDiv.appendChild(subject)
  titleDiv.appendChild(question)

  var votes = document.createElement('div')
  votes.classList.add('vote-count')
  var voteCount = document.createElement('sub')
  var voteDiff = disc.upvotes - disc.downvotes
  var symbol = voteDiff < 0 ? '&#8681; ' : '&#8679; '
  voteCount.innerHTML = symbol + voteDiff
  voteDiff < 0 ? voteCount.setAttribute('class', 'down') : voteCount.setAttribute('class', 'up')
  votes.appendChild(voteCount)

  var disc_div = document.createElement('div')
  disc_div.classList.add('main-disc-div')
  disc_div.setAttribute('key', disc.id)
  disc_div.addEventListener('click', () => openDiscussion(disc.id) )

  var sub_div1 = document.createElement('div')
  sub_div1.appendChild(titleDiv)
  sub_div1.appendChild(votes)
  sub_div1.classList.add('subject-div')
  
  var sub_div2 = document.createElement('div')
  sub_div2.setAttribute('class', 'extra-div')
  sub_div2.appendChild(dateTime)
  sub_div2.appendChild(timeLapsed)

  var sub_div3 = document.createElement('div')
  sub_div3.setAttribute('class', 'fav-div')
  sub_div3.innerHTML = disc.fav ? '&#11088;' : '&#9734;'

  disc_div.appendChild(sub_div1)
  disc_div.appendChild(sub_div2)
  disc_div.appendChild(sub_div3)

  discussionsNode.appendChild(disc_div)
}

const getDiscussions = (arr) => {
  discussionsNode.innerHTML = ''
  if(arr.length != 0){
    arr.map( disc => renderDiscussion(disc) )
  }
  else{
    var noDiscussions = document.createElement('p')
    noDiscussions.innerHTML = 'No Discussions Found !'
    discussionsNode.appendChild(noDiscussions)
  }
}

const createDiscussion = () => {
  var subject = document.getElementById('subject')
  var question = document.getElementById('question')
  if(subject.value != '' && question.value != ''){
    var obj = { id: Date.now(), question: question.value, subject: subject.value, response: [], upvotes: 0, downvotes: 0, fav: false }
    discussionsArray.push(obj)
    saveAPI(discussionsArray)
    subject.value = ''
    question.value = ''
    //re render discussions with new discussion
    renderDiscussion(obj)
    openDiscussion(obj.id)
  }
  else{
    window.alert('can\'t send empty data...')
  }
}

const renderResponse = (resp) => {
  if(respResponses.innerHTML == '<p style="padding: 10px;">No Responses !</p>')
    respResponses.innerHTML = ''
  
  var upperDiv = document.createElement('div')
  upperDiv.setAttribute('class','main-resp-sublist')
  upperDiv.setAttribute('key', resp.id)

  var voteCountDiv = document.createElement('div')
  voteCountDiv.setAttribute('class', 'vote-count')
  var voteCount = document.createElement('sub')
  var voteDiff = resp.upvotes - resp.downvotes
  var symbol = voteDiff < 0 ? '&#8681; ' : '&#8679; '
  voteCount.innerHTML = symbol + voteDiff
  voteDiff < 0 ? voteCount.setAttribute('class', 'down') : voteCount.setAttribute('class', 'up')
  voteCountDiv.appendChild(voteCount)

  var titleDiv = document.createElement('div')
  // titleDiv.style['width'] = '60%'
  var respName = document.createElement('p')
  respName.innerHTML = resp.name
  respName.classList.add('subject')
  var respComment = document.createElement('p')
  respComment.innerHTML = resp.comment
  respComment.classList.add('sub-subject')
  titleDiv.appendChild(respName)
  titleDiv.appendChild(respComment)

  var voteTitleDiv = document.createElement('div')
  voteTitleDiv.style['display'] = 'flex'
  voteTitleDiv.appendChild(voteCountDiv)
  voteTitleDiv.appendChild(titleDiv)

  var votes = document.createElement('div')
  votes.classList.add('votes')

  var upvotes = document.createElement('sub')
  upvotes.innerHTML = '&#8679; ' + resp.upvotes
  upvotes.onclick = (e) => responseVoting(e, 'up', resp.upvotes, resp.id)

  var downvotes = document.createElement('sub')
  downvotes.innerHTML = '&#8681; ' +  resp.downvotes
  downvotes.onclick = (e) => responseVoting(e, 'down', resp.downvotes, resp.id)
  
  votes.appendChild(upvotes)
  votes.appendChild(downvotes)

  var timeLapsed = document.createElement('div')
  timeLapsed.innerHTML = '<sub>Created ' + Math.floor((Date.now() - resp.id)/1000) + ' seconds ago...</sub>'
  timeLapsed.style['marginLeft'] = '10px'
  timeLapsed.style['marginTop'] = '10px'
  // setInterval( ()=> {
  //   timeLapsed.innerHTML = '<sub>Created ' + Math.floor((Date.now() - resp.id)/1000) + ' seconds ago...</sub>'
  // }, 1000 )

  var respDiv = document.createElement('div')
  // respDiv.appendChild(voteCountDiv)
  // respDiv.appendChild(titleDiv)
  respDiv.appendChild(voteTitleDiv)
  respDiv.appendChild(votes)
  respDiv.classList.add('subject-div-resp')

  upperDiv.appendChild(respDiv)
  upperDiv.appendChild(timeLapsed)
  respResponses.appendChild(upperDiv)
}

const openDiscussion = (id) => {
  //hide the 'new discussion div' and show the 'response div'
  var currentDisc = discussionsArray.find( disc => disc.id == id )
  var newDisc = document.getElementById('new-disc')
  newDisc.classList.add('invisible')
  var respDisc = document.getElementById('resp-disc')
  respDisc.classList.remove('invisible')

  //display the current subject and question
  respQuestion.innerHTML = ''
  respQuestion.setAttribute('key', currentDisc.id)

  var titleDiv = document.createElement('div')
  var questionSubject = document.createElement('div')
  var favBtn = document.createElement('button')
  favBtn.innerHTML = currentDisc.fav ? '&#11088;' : '&#9734;'
  favBtn.setAttribute('class', 'fav-btn')
  favBtn.onclick = (e) => favBtnHandler(e, currentDisc.id)
  questionSubject.innerHTML = currentDisc.subject
  questionSubject.classList.add('subject')
  questionSubject.appendChild(favBtn)
  var questionQuestion = document.createElement('p')
  questionQuestion.innerHTML = currentDisc.question
  questionQuestion.classList.add('sub-subject')
  titleDiv.appendChild(questionSubject)
  titleDiv.appendChild(questionQuestion)

  var votes = document.createElement('div')
  votes.classList.add('votes')

  var upvotes = document.createElement('sub')
  upvotes.innerHTML = '&#8679; ' + currentDisc.upvotes
  upvotes.onclick = (e) => questionVoting(e, 'up', currentDisc.upvotes, id)

  var downvotes = document.createElement('sub')
  downvotes.innerHTML = '&#8681; ' +  currentDisc.downvotes
  downvotes.onclick = (e) => questionVoting(e, 'down', currentDisc.downvotes, id)

  votes.appendChild(upvotes)
  votes.appendChild(downvotes)

  respQuestion.appendChild(titleDiv)
  respQuestion.appendChild(votes)

  //display the responses
  respResponses.innerHTML = ''
  if( currentDisc.response.length == 0 ){
    var noResponses = document.createElement('p')
    noResponses.style['padding'] = '10px'
    noResponses.innerHTML = 'No Responses !'
    respResponses.appendChild(noResponses)
  }
  else{
    currentDisc.response.sort( (b,a) => (a.upvotes - a.downvotes) - (b.upvotes - b.downvotes)  )
    currentDisc.response.map( resp => renderResponse(resp) )
  }

}

const questionVoting = (e, voteType, votes, id) => {
  votes++
  var symbol = voteType == 'up' ? '&#8679; ' : '&#8681; '
  e.target.innerHTML = symbol + votes
  // var id = respQuestion.getAttribute('key')
  var c_index = discussionsArray.findIndex( disc => disc.id == id )
  voteType == 'up' ? discussionsArray[c_index].upvotes = votes : discussionsArray[c_index].downvotes = votes
  saveAPI(discussionsArray)

  for( var i=0; i<discussionsNode.children.length; i++ ){
    if(discussionsNode.children[i].getAttribute('key') == id){
      var n = Number(discussionsNode.children[i].firstChild.lastChild.firstChild.innerHTML.split(' ')[1])
      voteType == 'up' ? n++ : n--
      symbol = n < 0 ? '&#8681; ' : '&#8679; '
      discussionsNode.children[i].firstChild.lastChild.firstChild.innerHTML = symbol + n
      discussionsNode.children[i].firstChild.lastChild.firstChild.setAttribute('class', n<0 ? 'down': 'up')
      break
    }
  }
}

const responseVoting = (e, voteType, votes, resp_id) => {
  votes++
  var symbol = voteType == 'up' ? '&#8679; ' : '&#8681; '
  e.target.innerHTML = symbol + votes
  var id = respQuestion.getAttribute('key')
  var currentDisc = discussionsArray[discussionsArray.findIndex( disc => disc.id == id )]
  var resp_searched = currentDisc.response[currentDisc.response.findIndex( r => r.id == resp_id )]
  voteType == 'up' ? resp_searched.upvotes = votes : resp_searched.downvotes = votes
  saveAPI(discussionsArray)
  var n = Number(e.target.parentNode.parentNode.firstChild.firstChild.firstChild.innerHTML.split(' ')[1])
  voteType == 'up' ? n++ : n--
  symbol = n < 0 ? '&#8681; ' : '&#8679; '
  e.target.parentNode.parentNode.firstChild.firstChild.firstChild.innerHTML = symbol + n
  e.target.parentNode.parentNode.firstChild.firstChild.firstChild.setAttribute('class', n<0 ? 'down': 'up')
}

const favBtnHandler = (e, id) => {
  var c_index = discussionsArray.findIndex( disc => disc.id == id )
  discussionsArray[c_index].fav = !discussionsArray[c_index].fav
  saveAPI(discussionsArray)

  e.target.innerHTML = discussionsArray[c_index].fav ? '&#11088;' : '&#9734;'

  for( var i=0; i<discussionsNode.children.length; i++ ){
    if(discussionsNode.children[i].getAttribute('key') == id){
      discussionsNode.children[i].lastChild.innerHTML = e.target.innerHTML
      break
    }
  }

}

//resolve button event
var resolve = document.getElementById('resolve')
resolve.addEventListener( 'click', () => {
  var id = respQuestion.getAttribute('key')
  newDiscBtn.click()
  discussionsArray = discussionsArray.filter( disc => disc.id != id )
  saveAPI(discussionsArray)
  for( var i=0; i<discussionsNode.children.length; i++ ){
    if(discussionsNode.children[i].getAttribute('key') == id){
      discussionsNode.children[i].remove()
      break
    }
  }
  if(discussionsNode.innerHTML == ''){
    var noDiscussions = document.createElement('p')
    noDiscussions.innerHTML = 'No Discussions Found !'
    discussionsNode.appendChild(noDiscussions)
  }
} )

//submit response button event
var submitResp = document.getElementById('submit-resp')
submitResp.addEventListener( 'click', () => {
  var id = respQuestion.getAttribute('key')
  var name = document.getElementById('resp-name')
  var comment = document.getElementById('resp-comment')
  if( name.value != '' && comment.value != '' ){
    var c_index = discussionsArray.findIndex( disc => disc.id == id )
    var obj = { id: Date.now(), name: name.value, comment: comment.value, upvotes: 0, downvotes: 0 }
    discussionsArray[c_index].response.push(obj)
    saveAPI(discussionsArray)
    name.value = ''
    comment.value = ''
    //for rendering the new response div
    renderResponse(obj)
  }
  else{
    window.alert('can\'t send empty data...')
  }
} )

//submit discussion button event
var submit_disc = document.getElementById('submit-disc')
submit_disc.addEventListener('click', createDiscussion)

//new discussion button event
var newDiscBtn = document.getElementById('disc-btn')
newDiscBtn.addEventListener( 'click', ()=>{ 
  var newDisc = document.getElementById('new-disc')
  newDisc.classList.remove('invisible')
  var respDisc = document.getElementById('resp-disc')
  respDisc.classList.add('invisible')
} )

//search bar implementation
var searchBar = document.getElementById('search')
searchBar.addEventListener( 'keyup', (e)=>{
  var query = e.target.value.toLowerCase()
  var tempDiscussionsArray = discussionsArray.filter( disc => disc.subject.toLowerCase().includes(query) || disc.question.toLowerCase().includes(query) )
  //render the search resulting discussions
  getDiscussions(tempDiscussionsArray)
} )

//timer ago thingy
setInterval( ()=> {
  //timer on left side discussions
  if( discussionsNode.children[0].tagName.toLowerCase() != 'p' ){
    for( var iter=0; iter<discussionsNode.children.length; iter++){
      var createdTime = discussionsNode.children[iter].getAttribute('key')
      discussionsNode.children[iter].children[1].lastChild.innerHTML = ' , about ' + Math.floor((Date.now() - createdTime)/1000) + ' seconds ago...'
    }
  }
  
  //timer on responses
  if( respResponses.innerHTML != '' ) {
    if( respResponses.children[0].tagName.toLowerCase() != 'p' ){
      for( var iter=0; iter<respResponses.children.length; iter++){
        var createdTime = respResponses.children[iter].getAttribute('key')
        respResponses.children[iter].lastChild.firstChild.innerHTML = 'Created ' + Math.floor((Date.now() - createdTime)/1000) + ' seconds ago...'
      }
    }
  }

}, 1000 )