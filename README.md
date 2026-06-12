TECH STACK:
HTML, CSS and JavaScript, no libraries, all content was made on Visual Studio Code.
Used LibreSprite for the default image and the site's icon.

MOTIVATION:
I started modifying images in 10th grade with the PIL module in Python for a mandatory class, and it really sparked my interest for coding (I found it cool).

Since then, I have used this newfound knowledge on multiple occasions, like making recolors of 2D skins for one of my game...
In one of my team projects, we had a problem with images not having enough padding on the sides, making them stretch out over too big of a surface, and the workarounds with the engine were very complicated.
So I decided to use PIL to add transparent padding to an image, and it worked wonderfully.

However, since then, I quit the development team, but they still needed a way to add padding to images...
That's when I had the idea to make this Image Editor, since it didn't need any backend and thus could be posted on pages, and I didn't know what else to make...

DESCRIPTION:
Image Editor is a website like many others, you first upload the image you want to modify, either by browsing through your files or dragging one into the designated area (that took me some time to make lol).

Upload button : 
<img width="500" height="80" alt="randomScreenshot" src="https://github.com/user-attachments/assets/42322cb6-0211-4aa1-ab68-856ea525579d" />

You can then recolor it, change specific colors, change your its opacity, add padding to it, merge multiple images into one, add text and much, much more.
At first I only wanted to add a few specific features, but then I got a little carried away...

You can do things like that :
<img width="256" height="256" alt="image" src="https://github.com/user-attachments/assets/a8d33bb8-95ea-4c4b-a3ee-817052826d46" />
(that's my pfp but modified) and I think it's pretty useful.

Since the V2, you can now edit an image multiple times in a row by clicking the button "Edit created image", this wasn't possible in the V1 as it used one web page per mode.

When you're satisfied with the result, the only thing left for you to do is dowload your image.
You also have access to a layer system that allows you to modify multiple images separately, then merge them, without using the merge images tool (kinda useless now...)

I also added Keybinds because why not?
Enter : Proccess the image (basically apply the modifications)
Shift + X : Clear canvas (and your mind at the same time)
Escape : Download Image
Tab : Edit the image you created

<img width="465" height="212" alt="image" src="https://github.com/user-attachments/assets/2245c2a3-2a3a-4eb0-be9e-04ac7a5fa9ae" />

HOW IT WORKS:
Every time you modify a parameter or update an image, the main script calls a function to proccess the image, this function will then modify the image according to the mode you chose and the parameters you put.
Most modes use HTML's canvas element to read the image data which allows you, similarly to PIL in Python, to iterate over every pixel in the image, and change it to your heart's desire.

For example, if you choose to put a white color filter, the script will iterate over every pixel and change its RGB code to a grey one.
Other modes just draw the image in a different place, or rotate it or distort it using already existent canvas features.
