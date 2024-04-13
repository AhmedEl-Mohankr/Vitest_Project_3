/*
This function show an error:
1- which takes a message
2- which then reaches out to the DOM to select an element
3- Then it creates an element.
4- After that, it sets the text content of that element.
5- It clears the first element that was selected
6- Then adds the newly created element as a child to that other element which was cleared before.

Summary:
the function outputs an error message and clears any existing content that might already have
been there.

issue:
This function relies on the DOM.(We rely om the existence of the document object) and then we use
the document object and certain methods provided by that object to interact with the DOM.
Example: to select elements or create or Add elements.

This is an issue as it is a side of effect however it won't cause any persistent problems the same 
as file systems. This is due that once the document object is reloaded, it will return to its
original state.
*/


export function showError(message) {
  const errorContainerElement = document.getElementById('errors');
  const errorMessageElement = document.createElement('p');
  errorMessageElement.textContent = message;
  errorContainerElement.innerHTML = '';
  errorContainerElement.append(errorMessageElement);
}
