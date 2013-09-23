// Constructor. Puts the syntax highlighted code in jquery wrapped HTML element
// $elem
var CodeReview = function(code, $elem) {
  console.assert($elem.length === 1);

  this.codeBlocks = [];
  var self = this;

  Rainbow.color(code, 'html', function(highlighted) {
    self.syntaxLines = highlighted.split('\n');
    var codeBlock = self.createCodeBlock(0, self.syntaxLines.length);
    self.codeBlocks.push(codeBlock);
    $elem.append(codeBlock.$codeElem);
  });
};


CodeReview.prototype.createCodeElem = function(startLine, endLine) {
  console.assert(startLine >= 0);
  console.assert(endLine > startLine);
  console.assert(endLine <= this.syntaxLines.length);

  var $pre = $('<pre/>');

  for (i = startLine; i < endLine; ++i) {
    var $numSpan = $('<span/>', {class: 'line-number'});
    $numSpan.append((i + 1).toString());
    $numSpan.click(_.bind(this.onLineClick, this, i));
    $pre.append($numSpan);
    $pre.append(this.syntaxLines[i]);
    $pre.append('\n');
  }

  return $pre;
};

CodeReview.prototype.createCodeBlock = function(startLine, endLine) {
  var block = {
    startLine: startLine,
    $comment: null,
    $codeElem: this.createCodeElem(startLine, endLine)
  };

  return block;
};

CodeReview.prototype.onLineClick = function(lineNum) {
  console.assert(lineNum >= 0);
  console.assert(lineNum < this.syntaxLines.length);

  // Frikin' JS doesn't have any built-in binary search algorithm, and
  // underscore and jquery's versions don't take a function that does the
  // comparison so we do things the slow way here.
  //
  // TODO(odain) Convert to binary search.
  for (var idx = 0; idx < this.codeBlocks.length; ++idx) {
    if (this.codeBlocks[idx].startLine >= lineNum) {
      break;
    }
  }

  if (idx === this.codeBlocks.length ||
      this.codeBlocks[idx].startLine > lineNum) {
    --idx;
  }

  $replaceCodeElem = 
      this.createCodeElem(this.codeBlocks[idx].startLine, lineNum + 1);
  this.codeBlocks[idx].$codeElem.replaceWith($replaceCodeElem);
  this.codeBlocks[idx].$codeElem = $replaceCodeElem;

  var $comment = $('<p>Hello World!</p>');

  this.codeBlocks[idx].$codeElem.after($comment);
  this.codeBlocks[idx].$comment = $comment;

  if (lineNum + 1 >= this.syntaxLines.length) {
    // They clicked the last line, so done.
    return;
  } else {
    if (idx + 1 < this.codeBlocks.length) {
      var endLine = this.codeBlocks[idx + 1].startLine;
    } else {
      var endLine = this.syntaxLines.length;
    }

    var newBlock = this.createCodeBlock(lineNum + 1, endLine);
    this.codeBlocks[idx].$comment.after(newBlock.$codeElem);

    this.codeBlocks.push(newBlock);
    this.codeBlocks.sort(function(a, b) { return a.startLine - b.startLine; });
  }
};


$(document).ready(function() {
  $codeDiv = $('#main');
  var code = ['<html>',
              '    <head>',
              '        <style>',
              '           p {color: red;}',
              '        </style>',
              '        <script>var x = document.ready();</script>',
              '    </head>',
              '    <body>',
              '        <p>This is a paragraph.</p>',
              '    </body>',
              '</html>'].join('\n');
  var review = new CodeReview(code, $codeDiv);
});
