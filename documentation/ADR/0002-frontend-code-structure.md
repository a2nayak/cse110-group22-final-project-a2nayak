---
# These are optional metadata elements. Feel free to remove any of them.
status: "proposed"
date: 2026-05-26
decision-makers: Anirudh Nayak
consulted: 
informed: 
---

# Manual Component-based Frontend

## Context and Problem Statement

Our prototype kept most of our JavaScript in a handful of files for quick development. However, as our app expands, we need to specify a clear architecture for our code to ensure that it is maintainable.

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* Clear separation of concerns between the frontend and backend
* Code encapsulation per feature
* Code semanticity with regards to files 
    - e.g. webpage structure should be mostly handled by HTML and CSS files
* Functions on most browsers

## Considered Options

* JS files per feature
* Web components
* Manual Component-based 

## Decision Outcome

Chosen option: Manual Component-based, because it acceptably satisfies the decision drivers.

## Consequences

Pros:
- Naturally separates most frontend code into the components, simplifying code
- Encapsulates features which are closely coupled to one component
- Allows for communication between closely related components by passing messages up the component tree
- If JS is not enabled, then the component easily falls back to the HTML/CSS structure
- Maintains code semanticity by having most structure in HTML, styling in CSS, and behavior in JS.
- Only uses vanilla JS, so it functions on most browsers

Cons:
- Component communication will likely have to be managed by a common ancestor component
- Managing global UI state will be slightly more challenging