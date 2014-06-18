/* LSCOLORS.js
 * Created by Geoff Greer 7/31/2006
 * 
 */


// I hate global variables, but these are necessary
var currentColorIndex = 0;
var indexLength = 22;
var colors = new Array('e','x','f','x','c','x','d','x','b','x','e','g','e','d','a','b','a','g','a','c','a','d');
var divIDs = new Array('directory','system_link','socket','pipe','executable','block_special','char_special','exe_setuid','exe_setgid','dir_writeothers_sticky','dir_writeothers_nosticky');


//Update the 'Bold' check boxes and keep track of which type of file we're changing
function updateColorIndex()
{
    var isGroundBold;

    currentColorIndex = document.getElementById('currentColorIndex').value * 2;

    if(isBold(currentColorIndex))
    {
        document.getElementById('isForegroundBold').checked = true;
    }
    else
    {
        document.getElementById('isForegroundBold').checked = false;
    }

    if(isBold(currentColorIndex + 1))
    {
        document.getElementById('isBackgroundBold').checked = true;
    }
    else
    {
        document.getElementById('isBackgroundBold').checked = false;
    }

}



//Change the color of a fore or background. This is called by the little color boxes in the html file.
function changeColor(color,isBackground)
{
   if(isBold(currentColorIndex + isBackground))
   {
      colors[currentColorIndex + isBackground] = color.toUpperCase();
   }
   else
   {
      colors[currentColorIndex + isBackground] = color;
   }

   updateColorString();
}



//Make text bold (basically capitalize it)
function BoldText(isBackground)
{
    colors[currentColorIndex + isBackground] = colors[currentColorIndex + isBackground].toUpperCase();

    updateColorString();
}



//(tolower the letter) 
function unBoldText(isBackground)
{
    colors[currentColorIndex + isBackground] = colors[currentColorIndex + isBackground].toLowerCase();

    updateColorString();
}



//Returns true if a letter is upper case
function isBold(index)
{
    return colors[index] && colors[index] == colors[index].toUpperCase();
}



//Updates the string in the input box
function updateColorString()
{
    var colorString = '';

    for(var i = 0; i < indexLength; i++)
    {
        colorString = colorString + colors[i];
    }

    document.getElementById('colorStringBSD').value=colorString;

    var colorStringLinux = translateColorToLinux(colorString);
    document.getElementById('colorStringLinux').value=colorStringLinux;

    makePreview();
}



//Updates the preview ls. (basically sets a bunch of attributes on various spans)
function makePreview()
{
    var color;
    var backgroundColor;
    var divColor;
    var divBackground;
    var divFontWeight;
    var i = 0;

    var colorString = document.getElementById('colorStringBSD').value;

    var colorStringLinux = translateColorToLinux(colorString);
    document.getElementById('colorStringLinux').value=colorStringLinux;

    for (i = 0; i < indexLength; i++)
    {
        colors[i]=colorString.charAt(i);
    }

    for (i = 0; i < indexLength; i+=2)
    {
        divFontWeight = document.getElementById(divIDs[i/2]);

        if(isBold(i))
        {
            divFontWeight.style.fontWeight = 'bold';
        }
        else
        {
            divFontWeight.style.fontWeight = 'normal';
        }

        color = translateColor(colors[i], isBold(i));
        divColor = document.getElementById(divIDs[i/2]);
        divColor.style.color = color;

        backgroundColor = translateColor(colors[i + 1], isBold(i + i));
        divBackground = document.getElementById(divIDs[i/2]);
        divBackground.style.backgroundColor = backgroundColor;
    }
}


function translateColor(color, bold)
{
    var i = color;
    if (bold)
    {
        i = i.toUpperCase();
    }
    return {
        'a': '#002b36',  // black
        'A': '#002b36',  // bold black
        'b': '#dc322f',  // red
        'B': '#cb4b16',  // bold red
        'c': '#859900',  // green
        'C': '#859900',  // bold green
        'd': '#b58900',  // yellow
        'D': '#b58900',  // bold yellow
        'e': '#268bd2',  // blue
        'E': '#268bd2',  // bold blue
        'f': '#d33682',  // magenta
        'F': '#6c71c4',  // bold magenta
        'g': '#2aa198',  // cyan
        'G': '#2aa198',  // bold cyan
        'h': '#eee8d5',  // white
        'H': '#fdf6e3'   // bold white
    }[i] || null;
}

function translateColorToLinux(colorString)
{
    var color = '';
    var linuxColorString = '';

    for (var i = 0; i < colorString.length; i++)
    {
        color=colorString.charAt(i);

        switch(i) {
            case 0:
                linuxColorString += 'di='; //directory
            break;
            case 2:
                linuxColorString += 'ln='; //symlink
            break;
            case 4:
                linuxColorString += 'so='; //socket
            break;
            case 6:
                linuxColorString += 'pi='; //pipe
            break;
            case 8:
                linuxColorString += 'ex='; //executable
            break;
            case 10:
                linuxColorString += 'bd='; //block device
            break;
            case 12:
                linuxColorString += 'cd='; //character device
            break;
            case 14:
                linuxColorString += 'su='; //setuid
            break;
            case 16:
                linuxColorString += 'sg='; //setgid
            break;
            case 18:
                linuxColorString += 'tw='; //other writable sticky
            break;
            case 20:
                linuxColorString += 'ow='; //other writable non-sticky
            break;
        }

        //Linux LSCOLORS has different codes for foreground/background colors :/
        if (i % 2 === 0) {
            //If bold, add bold thingy
            if(color == color.toUpperCase())
                linuxColorString += '1;';

            if(color == 'a' || color == 'x')
                linuxColorString += '0';    //default (black)
            else if(color == 'b')
                linuxColorString += '31';   //red
            else if(color == 'c')
                linuxColorString += '32';   //green
            else if(color == 'd')
                linuxColorString += '33';   //orange/brown
            else if(color == 'e')
                linuxColorString += '34';   //blue
            else if(color == 'f')
                linuxColorString += '35';   //magenta
            else if(color == 'g')
                linuxColorString += '36';   //cyan
            else if(color == 'h')
                linuxColorString += '37';   //grey
        }
        else {
            linuxColorString += ';';

            if(color == 'a' || color == 'x')
                linuxColorString += '40';    //default (black) background
            else if(color == 'b')
                linuxColorString += '41';   //red background
            else if(color == 'c')
                linuxColorString += '42';   //green background
            else if(color == 'd')
                linuxColorString += '43';   //orange/brown background
            else if(color == 'e')
                linuxColorString += '44';   //blue background
            else if(color == 'f')
                linuxColorString += '45';   //magenta background
            else if(color == 'g')
                linuxColorString += '46';   //cyan background
            else if(color == 'h')
                linuxColorString += '47';   //grey background

            linuxColorString += ':';
        }
    }

    return linuxColorString;
}


var colorElements = document.getElementsByClassName('color');
for (var i = 0; i < colorElements.length; ++i)
{
    var colorElement = colorElements[i];
    var colorData = colorElement.getAttribute('data-color');
    var color = translateColor(colorData[0]);
    if (color)
    {
        colorElement.style.backgroundColor = color;
    }
    else
    {
        colorElement.style.outlineWidth = '1px';
    }
    colorElement.onclick = function()
    {
        var colorData = this.getAttribute('data-color');
        changeColor(colorData[0], Number(colorData[1]));
    };
}
