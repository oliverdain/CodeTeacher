// Constructor. Puts the syntax highlighted code in jquery wrapped HTML element
// $elem
var CodeReview = function(code, $elem) {
  console.assert($elem.length === 1);

  this.codeBlocks = [];
  var self = this;

  Rainbow.color(code, 'html', function(highlighted) {
    self.syntaxLines = highlighted.split('\n');
    var codeBlock = self.createCodeBlock(self.syntaxLines, 0);
    self.codeBlocks.push(codeBlock);
    $elem.append(codeBlock.$codeElem);
  });
};

CodeReview.prototype.createCodeBlock = function(codeLines, startNumber) {
  var $pre = $('<pre/>');

  for (i = 0; i < codeLines.length; ++i) {
    var $numSpan = $('<span/>', {class: 'line-number'});
    $numSpan.append((i + 1).toString());
    $numSpan.click(_.partial(this.onLineClick, i));
    $pre.append($numSpan);
    $pre.append(codeLines[i]);
    $pre.append('\n');
  }

  var block = {
    startLine: startNumber,
    comment: null,
    $codeElem: $pre
  };

  return block;
};

CodeReview.prototype.onLineClick = function(lineNum) {
  console.log('Clicked: ' + lineNum);
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
