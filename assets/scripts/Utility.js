export class DOMHelper {
   static clearEventListeners(element) {
      const clonedElement = element.cloneNode(true);
      element.replaceWith(clonedElement);
      return clonedElement;
   }

   static moveElement(elementId, newDestinationSelector) {
      const element = document.getElementById(elementId);
      const destinationElement = document.getElementById(newDestinationSelector);
      destinationElement.append(element);
      element.scrollIntoView({ behavior: 'smooth' });
   }
}

export class Utility {
   static createGuid() {
      function _p8(s) {
         var p = (Math.random().toString(16) + "000000000").substr(2, 8);
         return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
   }

   static isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!  
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    static digitsOnly = string => [...string].every(c => '0123456789'.includes(c));
}


