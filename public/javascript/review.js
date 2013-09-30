// Constructor. Puts the syntax highlighted code in jquery wrapped HTML element
// $elem. code is a string holding the code. comments is an array of codeBlocks
// as constructed by createCodeBlock. commentChangeCb is called whenever new
// comments are added or old ones deleted. It is called with the complete
// comments array. $elem is the jquery wrapped element that should contain the
// code review.
var CodeReview = function(code, comments, commentChangeCb, $elem) {
  console.assert($elem.length === 1);

  this.commentChangeCb = commentChangeCb;
  this.codeBlocks = [];
  var self = this;

  Rainbow.color(code, 'html', function(highlighted) {
    self.syntaxLines = highlighted.split('\n');
    var codeBlock = self.createCodeBlock(0, self.syntaxLines.length);
    self.codeBlocks.push(codeBlock);
    self.commentsToCodeBlocks(comments, $elem);
  });
};

CodeReview.prototype.commentsToCodeBlocks = function(comments, $elem) {
  if (! comments || comments.length === 0) {
    comments = [{startLine: 0, comment: ''}];
  }

  console.assert(comments.length >= 1);

  for (var i = 0; i < comments.length; ++i) {
    var endLine;
    if (i === comments.length - 1) {
      endLine = this.syntaxLines.length;
    } else {
      endLine = comments[i + 1].startLine;
    }
    var block = this.createCodeBlock(comments[i].startLine, endLine);
    $elem.append(block.$codeElem);

    if (comments[i].comment && comments[i].comment.length > 0) {
      block.comment = this.getCommentObject(comments[i].comment);
      $elem.append(block.comment.$elems);
    } else {
      block.comment = null;
    }
  }
};

CodeReview.prototype.createCodeElem = function(startLine, endLine) {
  console.assert(startLine >= 0);
  console.assert(endLine > startLine);
  console.assert(endLine <= this.syntaxLines.length);

  var $pre = $('<pre/>');

  for (i = startLine; i < endLine; ++i) {
    var $numSpan = $('<span/>', {class: 'line-number'});
    $numSpan.append((i + 1).toString());
    $numSpan.click(_.bind(this.addComment, this, i));
    $pre.append($numSpan);
    $pre.append(this.syntaxLines[i]);
    $pre.append('\n');
  }

  return $pre;
};

// startLine is the 0-based index of the first line of code in the code block.
// endLine is the 0-based *exclusive* index of the last line in the comment
// block. The comment itself applies to the last line in the code block; in
// other words, the comment applies to endLine - 1.
CodeReview.prototype.createCodeBlock = function(startLine, endLine, comment) {
  var block = {
    startLine: startLine,
    comment: null,
    $codeElem: this.createCodeElem(startLine, endLine)
  };

  return block;
};

CodeReview.prototype.addComment = function(lineNum) {
  console.assert(lineNum >= 0);
  console.assert(lineNum < this.syntaxLines.length);

  // Frikin' JS doesn't have any built-in binary search algorithm, and
  // underscore and jquery's versions don't take a function that does the
  // comparison so we do things the slow way here.
  //
  // TODO(odain) Convert to binary search.
  for (var idx = 0; idx < this.codeBlocks.length; ++idx) {
    if (this.codeBlocks[idx].startLine === lineNum + 1) {
      console.debug('There is already a comment on this line. Ignoring the click.');
      return;
    }

    if (this.codeBlocks[idx].startLine > lineNum) {
      break;
    }
  }

  if (idx === this.codeBlocks.length &&
      (lineNum === this.syntaxLines.length - 1)) {
    // We're trying to add a comment to the last line. There's an edge condition
    // here we need to check for to be sure there isn't already a comment there.
    if (this.codeBlocks[this.codeBlocks.length - 1].comment !== null) {
      console.debug('The last line already has a comment. Ignoring click.');
      return;
    }
  }

  // Above we found the first block *after* the one we clicked on, so back up.
  --idx;

  $replaceCodeElem = 
      this.createCodeElem(this.codeBlocks[idx].startLine, lineNum + 1);
  this.codeBlocks[idx].$codeElem.replaceWith($replaceCodeElem);
  this.codeBlocks[idx].$codeElem = $replaceCodeElem;

  var comment = this.getCommentObject();

  this.codeBlocks[idx].$codeElem.after(comment.$elems);
  this.codeBlocks[idx].comment = comment;

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
    this.codeBlocks[idx].comment.$elems.after(newBlock.$codeElem);

    this.codeBlocks.push(newBlock);
    this.codeBlocks.sort(function(a, b) { return a.startLine - b.startLine; });
  }
};

CodeReview.prototype.callSaveCallback = function() {
  var toSave = [];
  for (var i = 0; i < this.codeBlocks.length; ++i) {
    var c = {};
    c.startLine = this.codeBlocks[i].startLine;
    if (this.codeBlocks[i].comment) {
      c.comment = this.codeBlocks[i].comment.value;
    } else {
      c.comment = '';
    }
    toSave.push(c);
  }

  this.commentChangeCb(toSave);
};

// Returns the controls for adding comments to the given line.
CodeReview.prototype.getCommentObject = function(comment) {
  var commentObj = {
    value: ''
  };

  var $wrapper = $('<div/>', {class: 'comment-wrapper'});
  var $textarea = $('<textarea/>', {rows: 10, cols: 80});
  if (comment) {
    $textarea.val(comment);
  }
  var $save = $('<button/>', {disabled: true}).text('Save');
  var $cancel = $('<button/>', {disabled: true}).text('Cancel');

  var self = this;

  $save.click(function(event) {
    commentObj.value = $textarea.val();
    _.bind(self.callSaveCallback, self)();
    $save.attr('disabled', true);
    $cancel.attr('disabled', true);
  });

  $cancel.click(function(event) {
    $textarea.val(commentObj.value);
    $cancel.attr('disabled', true);
    $save.attr('disabled', true);
  });

  var onModify = function(event) {
    $save.attr('disabled', false);
    $cancel.attr('disabled', false);
  };

  $textarea.change(onModify);
  $textarea.keyup(onModify);

  var $btnWrapper = $('<div/>', {class: 'comment-buttons'});
  $btnWrapper.append($save, $cancel);
  $wrapper.append($textarea, $btnWrapper);
  
  commentObj.$elems = $wrapper;

  return commentObj;
};

// Returns an array of Objects suitable for serializing to JSON. These objects
// are sufficient to reconstruct the review.
CodeReview.prototype.getReviewData = function() {
  var result = [];
  for (var i = 0; i < this.codeBlocks.length; ++i) {
    var curBlk = this.codeBlocks[i];
    var d = {startLine: curBlk.startLine};
    if (curBlk.$comment !== null && curBlck.comment.value.length > 0) {
      d.comment = curBlk.comment.value;
    }
    result.push(d);
  }

  return result;
}
