//import firebase from "firebase/compat/app";
// Required for side-effects
//import "firebase/firestore";
import {initializeApp} from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore'

import {
  getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from 'firebase/auth'


//import {getArticle} from './newsApi.js'

 //const http = require('https');
 //const express = require('express');
 //const port = 1337;


 //const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyCVfGTmL1R7133iYwy4-jWjb9yIXbHfQKY",
  authDomain: "ez-news-48049.firebaseapp.com",
  projectId: "ez-news-48049",
  storageBucket: "ez-news-48049.appspot.com",
  messagingSenderId: "551721682489",
  appId: "1:551721682489:web:afbc6d5311efb2c0276fe8",
  measurementId: "G-WW36CY5L7E"
};

  //init firebase app
  initializeApp(firebaseConfig)

  
 

  // init services
  const db = getFirestore()
  const auth =getAuth()

  // collection ref
  const colRef = collection(db, 'articles')

  //queries
  const q = query(colRef, orderBy('createdAt', 'desc'))

  const dataList = document.getElementById('article-list');
  //const dataList = document.querySelector()

  //get realtime collection data
  


  onSnapshot(q, (snapshot) => {
    let articles = []
    let html = '';
    snapshot.docs.forEach( (doc) => {
        articles.push({...doc.data(), id: doc.id})
        const data = doc.data();
        const li =`<li>
        <div class="collapsible-header"> 
        <span>${data.title}</span>
        <br>
        <a href="${data.url}" target="_blank" class="collapsible-url">${data.url}</a>
        </div>
        <div class="collapsible-body"> ${data.content} </div>
        </li>
        `;
        html += li;
        
        //const listItem = document.createElement('li');
       // listItem.textContent = `${data.title} - ${data.content}`;
        //dataList.appendChild(listItem);
  })
  dataList.innerHTML = html;
  console.log(articles)
})


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
   M.Collapsible.init(elems);
});



  //adding documents
  const addArticleForm = document.querySelector('.add')
  addArticleForm.addEventListener('submit', (e) => {
    e.preventDefault()

    
    addDoc(colRef, {
        title: addArticleForm.title.value,
        content: addArticleForm.content.value,
        createdAt: serverTimestamp()
    }).then( () => {
        addArticleForm.reset()
        
    })
  })

  //deleting documents
  const deleteArticleForm = document.querySelector('.delete');
  deleteArticleForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'articles', deleteArticleForm.id.value)

    deleteDoc(docRef).then(() => {
        deleteArticleForm.reset()
    })
  })

//get a single document

const docRef = doc(db, 'articles', 'NC8WctbGCl9pwwzkx6DD')

getDoc(docRef).then( (doc) => {
    console.log(doc.data(), doc.id)
})

//signing a user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth,email, password ).then( (cred) => {
    console.log('user created: ', cred.user)
    signupForm.reset()
  }).catch((err) => {
    console.log(err.message)
  })
})


//log in and log out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
signOut(auth).then(() => {
  console.log('user signed out')
}).catch((err) => {
  console.log(err.message)
})
})

const loginForm= document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email,password).then((cred) => {
    console.log('user logged in', cred.user)
  }).catch((err) => {
    console.log(err.message)
  })
})

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click',(e) => {
  window.location.href = '/login.html';
} )


onAuthStateChanged(auth, (user) => {
  console.log(user);
})



/*
const newsForm = document.querySelector('.newsButton')
newsForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const article = getArticle();
  console.log(article);
})

*/