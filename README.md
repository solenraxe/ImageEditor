TECH STACK:
HTML, CSS and JavaScript, no libraries, all content was made on Visual Studio Code.

MOTIVATION:
My interest for coding and developing started in 10th grade, where we had a class to discover Python, HTML and CSS.
It's in that class that I learned how to modify images using PIL in Python.
Since then, I have used the PIL module for multiple purposes, like making recolors of skins for some of my games...
In one of my team projects, we had a problem with images not having enough padding on the sides, making them stretch out over too big of a surface, and the workarounds with the engine were very complicated.
So I decided to use PIL to add transparent padding to an image, and it worked wonderfully.
However, since then, I quit the development team, but they still needed a way to add padding to images...
That's when I had the idea to make this Image Editor, since it didn't need any backend and thus could be posted on pages, and I didn't know what else to make...

DESCRIPTION:
Image Editor is a website like many others, you first upload the image you want to modify.
You can then recolor it, change specific colors, change your its opacity, add padding to it, and merge multiple images into one.
This all may seem a bit random, but I only added what the development team mentioned before asked me to, my goal was to not let them down too much...
Since the V2, you can now edit an image multiple times in a row by clicking the button "Edit created image", this wasn't possible in the V1 as it used one web page per mode.
When you're satisfied with the result, the only thing left for you to do is dowload your image.
<img width="400" height="180" alt="image" src="https://github.com/user-attachments/assets/3db3e666-4898-451e-b6b5-bc82f7f61bb7" />

HOW IT WORKS:
Every time you modify a parameter or update an image, the main script calls a function to proccess the image, this function will then modify the image according to the mode you chose and the parameters you put.
Every mode, except for merge images, uses HTML's canvas element to read the image data, similarly to PIL in Python, you can then iterate over every pixel from the image, and change it to your heart's desire.
For example, if you choose to put a white color filter, the script will iterate over every pixel and change its RGB code to a grey one.
If you had a pixel that had the (35, 65, 50) RGB code, it'll calculate the average color (150/3 = 50) and set the RGB code to (50, 50, 50).
The same principle applies to any other color filter.
