stickUp
=======
a jQuery plugin

A simple plugin that "sticks" an element to the top of the browser window while 
scrolling past it. For better experience it optionally offers reappearance only 
after scrolling up.

Please Visit the <a href="http://lirancohen.github.io/stickUp">GitHub Page</a> 
for installation instructions.



### Updated version

+ This version strips one pager highlighting feature and 
contains code cleanup for multiple instances and several improvements

##Configuration options

###General

**scrollHide**
When ticket stickUp will keep the element hidden when scrolling past it but show 
it immediatly when scrolling up again (like adressbar in Chrome for Android).
This feature allows better screen space usage while offering the sleek UI 
shortcut of standard sticking behavoiur.
```
default: true
options: integer
```

**topMargin**
option to control margin of sticked element
```
default: 'auto'
options: 'auto', number, '10px'
```

The original implementation is at 
[LiranCohen repository](https://github.com/LiranCohen/stickUp)