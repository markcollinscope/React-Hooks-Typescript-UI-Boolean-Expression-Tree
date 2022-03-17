## React Based Boolean Expression Construction and Evaluation - Typescript - Hooks and Classes shown.

![boolean expressions in react...](images/exp.png)

### Boolean Expression Evaluation Using Tree Structures on the UI (web).
Objective:
* show recursive use of React components on the UI for rendering - using functions/hooks.
* show the seperation of UI logic from underlying business logic (in this case, evaluation of boolean expressions) and how the two aspects of the application are integrated.
* to support this article as an example: https://www.infoq.com/articles/arm-enterprise-applications

### RUNNING THE APP
* use tagged version: 22.03.01-23.14_V1.0.0_GITREL - that is aligned with this README.
* 'npm start' - to start the development server - listen on localhost:3000 (should auto-start browser).
* 'npm test' - to run the domain level unit tests (Exp.test.ts). Uses 'jest' (sort of...)
* nb: will have to run npm install... (no effort has been made to distinguish runtime versus dev dependencies here)

### SPECIFICATION
The specification for the app shown here is to:
* create a web based application that enables the creation and manipulation of boolean expression, showing both the result of evaluating the expression and also a text representation of the expression. A 'tree' structure of some sort should be shown on the UI - to enable AND, OR, NOT (etc) expressions to be used.
* it should be able to handle all the normal boolean operators, and also allow for the insertion of constant values  (true, false).
* it should allow the boolean expressions to be nested to an arbitrary level of complexity (and of and of and of or of and of ...)
* it should allow for the use of 'undefined' as a constant. Any boolean expression involving an 'undefined' value should evaluate to undefined. E.g. 'And ( Undefined, True )' = 'Undefined', etc.
* there must be a mechanism on the UI to enable the selection of boolean operators (And, Nand ...) and/or constants (False, Undefined) to be added to the overall boolean expression at any place in the expression tree.

### SOURCE CODE STRUCTURE (SEE src DIR)

```
[ key: X ---> Y: X depends on (imports from) Y. ]

App.tsx (interface) [----> Exp too]
   |  
   |
ExpView.tsx (interface)             Exp.test.ts (test)
   |                                        |
   |->ExpNodePartView.tsx (interface)       |
   |  |                                     |
   |  |                                     | 
   V  V                                     | 
 Exp.ts (domain)<----------------------------
   |
   |-----------|
   V           V
AppError.ts  utils.ts (infrastructure) (nb: most modules use these, as is normal)
```

* no cycles, etc in dependencies.
* seperation of business logic and UI code and infrastructure (Domain Seperation Principle).
* see also: https://www.infoq.com/articles/arm-enterprise-applications - for the architectural basis of modules subdivision;
  this app is is quite small, so doesn't need all the 'strata' - in particular there's no need for an 'application strata' here). The strata shown (interfae, domain etc) can be referenced in the article
* classes in Exp.ts follow the 'O-L-I' parts of the SOLID principles (Open Closed, Liskov Substitution Principle, Integration Segregation Princple...

In terms of the article here: https://www.infoq.com/articles/arm-enterprise-applications here is the allocation of the source code files to strata (or layers) as explained in the article.

* App - Interface
* ExpView - Interface
* ConstExpView - Interface
* Exp - Domain (nb: there is no 'application' strata in this app, it is too small.
* utils - InfraStructure.
* React, Typescript libs, etc - Platform.


### CODE PARADIGMS USED.

* OO Style adopted (Expression evaluation is very suited to this) - though it could have been done function / procedural style... - but OO *really* was invented for this sort of problem!
* React functions with hooks are used - converting between functions/hooks and React classes took less than 30 minutes per UI file.

other:
* Source code layout style is easily changed automatically. Don't get hung up. I am not bothered which style I use.
* nb: having said that, wars have been fought over the position of a curly brace... beware! :-). [that's humour, FYI]

import mechanism:
* import/export used (rather than 'require ...'' - ie. not the Nodejs (commonJS) style...

naming:
* Class (capital first letter for name)
* variableOfSomeSort (lower case, camel-case style
* CONSTANT_IMMUTABLE_VALUE (intention is these values can't [and shouldn't] be changed).

### TEST CODE (xxxx.test.ts - TEST CODE FOR MODULE xxxx.ts)
* all tests pass - uses: jest (pretty basic use)
* coverage is reasonably good.
* 'npm test' to run tests.

### TOOLS (versions used)
* tsc - 4.4.3
* node - 16.X.X
* npm - 8.1.0

### CSS (style.css) - Currently only one style file used. Prefer multiple files, but there's not enough UI yet.
* App is responsive - will respond to resizing of browser window - but need some media queries to improve that.
* a 'micro-styles' approach has been used - for this example at least.
* styles are only for this app - and are pretty basic. This is not an exercise in excellence in CSS (as you'll notice).

