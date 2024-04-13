import { beforeEach, it, vi, expect } from "vitest";
import fs from "fs";
import path from "path";
import { Window } from "happy-dom";
import { showError } from "./dom";

/*
The following test will fail because in the test, the document is not defined.
To tackle this issue, we can provide a global stub, a global mock function.

- We can build our own document then use vi.stubGlobal to set the global document object to our 
own document object. however, unlike the fetch function, the document object is a very complex object.

- Both Jest and Vitest support the DOM virtually.
- When you are working with Vitest or jest, you can choose a testing environment in which your test
code will be executed. For example:

1- - Choose NodeJS (That is the default) for both jest and vitest.
... You will have access to all the nodeJS APIs and modules like the file system module inside 
the testing code and inside the code that is executed by your testing code.
... But you can't interact with the browser or browser specific APIs. 
..., You can't call the fetch function or the document object. You have to bring your own mock 
objects.

2- - JSDOM:
.. It is a virtual DOM environment that is created by the test runner behind the scenes.(It is still
    not using the actual browser but it is emulating that your code runs in the browser)

3- - Happy-Dom:
This is another tool similar to JSDOM. (Virtual) browser environment with browser APIs & THE DOM.
(2 and 3) They are ideal for testing frontend code and projects.

-- ALL you have to do is go the package.json and go "scripts" beside vitest --run you can add another flag
--environment and set it to "jsdom". or happy-dom which is vitest specifically.

------------------- 
- After choosing the dom environment and the document is available.
You have to keep in mind that the tests still 'don't execute in the context' fo this HTML file
that belongs to this project. That would be the file which you load in the browser but we have no
browser. Instead, we have some specific APIs available but at no point did we load this HTML file 
when we started executing our tests. So we need our INDEX.HTML code to be in our DOM for dom.js function
to work.


- We need to do Initialization (some test specific setup work that ensures that we can execute our test code
    the way we want).
    - To be precise, we want to open the hTML FILE and load it into this virtually emulated DOM which
    is provided by happy-dom so that when we then use the document object, we do interact with 
    a virtual dom that has all these html elements loaded into it.

    ----------------------------------------------------------------

    - To do So:
    ------------
    1- Import FS from 'FS' => file system module from nodejs.
    2- Import path from 'path' => so that I can open a file and load a file's content. Because 
    we want to load the index.html file.
    3-  We can get our HTML doc path by using path.join 
    4- We will pass the current working directory with process current working
     directory (process.cwd) so that will be the overall project directory.
     5- the second argument that we will pass the join method is => index.html that i wanna load.
    6- Setting htmlDocument content which is inside the html file can be loaded with fs read file
    sync => fs.readFileSync() which is basically halt code execution until the file has been read.
    7- We will pass the doc path as an argument.
    8- We will also convert the result to a string. and we can then use it to load it into the 
    virtually emulated DOM. 
    
    And this loading into the DOM is then done by: 
    A- Importing {window} from 'happy-dom' in vitest 

    9- Then we can create a window object by instantiating window. (This is now ceates an 
        emulated browser but a browser with a page loaded that we can configure.
    
    10- We can get now the 'document' by accessing window.document. This is now all provided by 
    happy-dom.
    11- On this document, we can call the write method document.write() to write this HTML document
    content which we loaded from the HTML file into this virtual document (emulated browser). This now
    renders this page virtually.

    12 - We use the vi object to stub the document globally with the adjusted document.
*/

const htmlDocPath = path.join(process.cwd(), "index.html");
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window();
const document = window.document;
vi.stubGlobal("document", document);

beforeEach(() => {
  document.body.innerHTML = "";
  document.write(htmlDocumentContent); //To rewrite the document and set it to the original HTML document
});

// first test will be for testing showError function should add an error paragraph.
//This is the core function of dom.js => should add a paragraph to the error container #errors.

it("should add an error paragraph to the id='errors' element", () => {
  showError("test"); //it doesn't matter if we include a value or not as we are just testing the execution.
  const errorsEl = document.getElementById("errors");
  //we wanna check if there is a paragraph within it as that is what the show error function should do.
  const errorParagraph = errorsEl.firstElementChild;
  //set expectations => expect the error paragraph not to be null.
  //if error paragraph would not find any element inside (firstElementChild) then error paragraph will be null.
  expect(errorParagraph).not.toBeNull();
});

//The following test should not contain an error paragraph initially as we should add one when we call showError.
it("should not contain an error paragraph initially", () => {
  const errorsEl = document.getElementById("errors");
  const errorParagraph = errorsEl.firstElementChild;
  expect(errorParagraph).toBeNull();
  /*
There shouldn't be an error. 
This test will fail because we did find a paragraph when we actually did not want to.
Also because showError is part of the emulated dom so this test is part off and because we call 
it on the first test, it will then apply to the second test.

-- To solve this issue, we will need to make sure that we reset any changes we made after every test
or before every test. In our case, we will before every test. So we will use beforeEach();
Within beforeEach, we want to reset our virtual document.

So we will wrap document.write(htmlDocumentContent); within beforeEach => so before every test 
I rewrite the document and 
we set it to the original HTML document content => fs.readFileSync(htmlDocPath).toString();.
However, this will append content to the existing document and 
we want to override the current document content instead
 by using document.body.innerHTML and set it to empty string.
*/
});

//The following test to test whether the error message is also respected or not.
it("should output the provided message in the error paragraph", () => {
  const testErrorMessage = "test";
  showError(testErrorMessage);
  const errorsEl = document.getElementById("errors");
  const errorParagraph = errorsEl.firstElementChild;
  expect(errorParagraph.textContent).toBe(testErrorMessage);
});

/*
Instead of writing and selecting all these elements, we can use a third-party library that
works well with vitest and jest 'Testing Library' which is a library that gives you a lot of 
utility functions and methods that make working with a virtual DOM and with writing tests for
a DOM-specific code much easier


*/
