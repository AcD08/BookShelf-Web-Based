// STORAGE DATA
const STORAGE_KEY = "BOOKS_DATA";
 
let books = [];
 
function isStorageExist() {
   if(typeof(Storage) === undefined){
       alert("Browser yang digunakan tidak mendukung local storage");
       return false;
   }
   return true;
}
 
function saveData() {
   const parsed = JSON.stringify(books);
   localStorage.setItem(STORAGE_KEY, parsed);
   document.dispatchEvent(new Event("datasaved"));
}
 
function loadDataFromStorage() {
   const storedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(storedData);
   
   if(data !== null)
       books = data;
 
   document.dispatchEvent(new Event("dataloaded"));
}
 
function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}
 
function composeBooksObject(title, author, year, isCompleted) {
   return {
       id: +new Date(),
       title,
       author,
       year,
       isCompleted
   };
}
 
function findBook(bookId) {
   for(book of books){
       if(book.id === bookId)
           return book;
   }

   return null;
}
 
 
function findBookIndex(bookId) {
   let index = 0;
   for (book of books) {
       if(book.id === bookId)
           return index;
 
       index++;
   }
 
   return -1;
}

function refreshDataBooks() {
    const uncompletedBooksList = document.getElementById(incompletedBooksID);
    const completedBooksList = document.getElementById(completedBooksID);
    for(book of books){
        const newBooks = makeBooks(book.title, book.author, book.year, book.isCompleted);
        newBooks[booksDataID] = book.id;
        if(book.isCompleted){
            completedBooksList.append(newBooks);
        } else {
            uncompletedBooksList.append(newBooks);
        }
    }
 }


// SCRIPT
document.addEventListener("DOMContentLoaded", function (){
    const inputForm = document.getElementById("input_book");

    inputForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBooks();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }

});

document.addEventListener("datasaved", () => {
    console.log("Data berhasil disimpan.");
 });

 document.addEventListener("dataloaded", () => {
    refreshDataBooks();
 });



// DOM

const incompletedBooksID = "incompletedBooks";
const completedBooksID = "completedBooks";
const booksDataID = "bookId";

function addBooks () {
    const uncompletedBooksList = document.getElementById(incompletedBooksID);
    const completedBooksList = document.getElementById(completedBooksID);
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const finishRead = document.getElementById("isFinishReading").checked;
    const newBooks = makeBooks(titleBook, authorBook, yearBook, finishRead);
    const booksObject = composeBooksObject(titleBook, authorBook, yearBook, finishRead);
    newBooks[booksDataID] = booksObject.id;
    books.push(booksObject);
    if (finishRead == true) {
        completedBooksList.append(newBooks);
    } else {
        uncompletedBooksList.append(newBooks);
    }

    updateDataToStorage();

}

function makeBooks (title, author, year, isCompleted) {
    const textTitle = document.createElement('h3');
    textTitle.innerHTML =  `Book Title: <span> ${title} </span>`;
    textTitle.classList.add('title-books')
    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = `Author: <span> ${author} </span>`;
    textAuthor.classList.add('author-books');
    const textYear = document.createElement('p');
    textYear.innerHTML = `Year Book: <span> ${year} </span>`;
    textYear.classList.add('year-books');

    const container = document.createElement('div');
    container.classList.add('innerBook');
    container.append(textTitle, textAuthor, textYear);

    if (isCompleted) {
        container.append(createUndoButton(), createDeleteBtn());
    } else {
        container.append(createFinishedBtn(), createDeleteBtn());
    }
    return container;

}

function createBtn(btnTypeClass, textBtn, eventListener) {
    const button = document.createElement("button");
    button.classList.add('btn', btnTypeClass);
    button.innerText = textBtn;
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addBooksToCompleted(booksElement) {
    const completeBooks = document.getElementById(completedBooksID);
    const bookTitle = booksElement.querySelector('.title-books span').innerText;
    const bookAuthor = booksElement.querySelector('.author-books span').innerText;
    const bookYear = booksElement.querySelector('.year-books span').innerText;
    const newBook = makeBooks(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(booksElement[booksDataID]);
    book.isCompleted = true;
    newBook[booksDataID] = book.id;

    completeBooks.append(newBook);
    booksElement.remove();

    updateDataToStorage();
} 

function removeBooksFromCompleted(booksElement){
    const booksIndex = findBookIndex(booksElement[booksDataID]);
    books.splice(booksIndex, 1);
    booksElement.remove();
    updateDataToStorage();
}

function undoBooksFromCompleted(booksElement){
    const uncompletedBooksList = document.getElementById(incompletedBooksID);
    const bookTitle = booksElement.querySelector('.title-books span').innerText;
    const bookAuthor = booksElement.querySelector('.author-books span').innerText;
    const bookYear = booksElement.querySelector('.year-books span').innerText;
    const newBook = makeBooks(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(booksElement[booksDataID]);
    book.isCompleted = false;
    newBook[booksDataID] = book.id;
    uncompletedBooksList.append(newBook);
    booksElement.remove();
    updateDataToStorage();
}

function createFinishedBtn() {
    return createBtn("btn-finished", 'Finished', function(e){
         addBooksToCompleted(e.target.parentElement);
    });
}

function createUndoButton() {
    return createBtn("btn-undo", 'Undo', function(e){
        undoBooksFromCompleted(e.target.parentElement);
    });
}

function createDeleteBtn() {
    return createBtn("btn-delete", 'Delete', function(e){
         confirm('Are you sure want to delete the book?');
         removeBooksFromCompleted(e.target.parentElement);
    });
}









