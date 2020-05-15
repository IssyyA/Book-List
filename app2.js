//Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

//UI Class

class UI {
    //UI Methods
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        //Create new element
        const row = document.createElement('tr');

        //Add inner html
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>`

        //Append row to list
        list.appendChild(row);
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    //Dispaly Alert
    showAlert(message, className) {
        //Create div
        const div = document.createElement('div');
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

}


//Local Storage class
class Store {
    //Store static methods
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI();
            //Add book to UI
            ui.addBookToList(book);
        })

    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn) {
        const books = Store.getBooks()

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books));

    }
}


//Add Event Listeners

//Event listener for document
document.addEventListener('DOMContentLoaded', Store.displayBooks)

//eventListener to add book
document.getElementById('book-form').addEventListener('submit',
    function(e) {
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value;

        const book = new Book(title, author, isbn)
        const ui = new UI()

        if (title === '' || author === '' || isbn === '') {
            ui.showAlert('Please fill in all fields', 'error')
        } else {
            ui.addBookToList(book);

            //Add book to local storage 
            Store.addBook(book);
            ui.clearFields();
            ui.showAlert('Book Added', 'success')
        }

        e.preventDefault();
    });

//Add event listener to delete book
document.getElementById('book-list').addEventListener('click',
    function(e) {
        //Instantiate UI
        const ui = new UI()

        ui.deleteBook(e.target)
            //Remove book from Local storage
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        //Show Alert
        ui.showAlert('Book Deleted', 'error')
        e.preventDefault()
    })