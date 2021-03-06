var marked                    = require('marked')
  , fs                        = require('fs')
  ;

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

function outline(uri, cb) {
  fs.readFile(uri, 'utf8', cb, function (err, data) {
    if (!err) {
      var lex     = new marked.Lexer().lex(data)
        , headers = lex.filter(function(item){ return item.type == 'heading'; })
        , outline = []
        ;

      for (var i = 0; i < headers.length; i++) {
        var element = headers[i];

        switch(element.depth) {
          case 1:
            outline.push(element);
            break;
          case 2:
            var h1 = outline.last();
            if (h1) {
              h1.items = h1.items || [];
              h1.items.push(element);
            }
            break;
        }
      };

      cb(undefined, outline);
    } else {
      cb(err);
    }
  });
};

module.exports = {
  outline : outline
}