function Node()
{
    this.name = '';
    this.type = 'normal';
    var parent = null;
    var children = [];
    var level = 0;
    
    this.children = function() {
        return children;
    };
    
    this.parent = function() {
        return parent;
    };
    
    this.level = function() {
        return level;
    };
    
    if (arguments[0]) {
        var args = arguments[0];
        if ('name' in args) {
            this.name = args.name;
        }
        if ('type' in args) {
            this.type = args.type;
        }
        if ('children' in args) {
            children = args.children();
        }
        if ('parent' in args) {
            parent = args.parent;
        }
        if ('level' in args) {
            level = args.level;
        }
    }
    
    this.addChild = function(node) {
        
        if (node) {
            node.parent = this;
            node.level = this.level() + 1;
        }
        else
        {
            node = {parent: this, level: this.level() + 1};
        }
        
        children.push(new Node(node));
    };
    
}

function Tree()
{
    this.root = new Node({type: 'root'});
}
