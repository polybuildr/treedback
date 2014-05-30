
var randTree = new Tree();
function generate() {
for (var i = 0; i < 3; ++i) {
        var children, n;
        randTree.root.addChild({name: i});
        randTree.root.children()[i].addChild();
    
        if (Math.random() * 2 > 1) {
            randTree.root.children()[i].addChild();
        }
        
        if (Math.random() * 2 > 1) {
            children = randTree.root.children();
            n = children.length;
            children[Math.floor(Math.random() * n)].addChild();
        }
        
        if (Math.random() * 2 > 1) {
            children = randTree.root.children();
            n = children.length;
            var childChild = children[Math.floor(Math.random() * n)];
            children = childChild.children();
            n = children.length;
            children[Math.floor(Math.random() * n)].addChild();
            children[Math.floor(Math.random() * n)].addChild();
        }
    }
}
generate();
function FBT(c, tree, konfig) {
    
    var t = tree ? tree : new Tree();
    
    var defaultConfig = {
        zoomFactor      : 1.1,
        nodeRadius      : 30,
        nodeColor       : '#057cb8',
        nodeGlowColor   : '#FF8C00'
    };
    
    var container = c ? c : document.body;
    
    var paper = new Raphael(container);
    
    container = $(container);
    
    var config = defaultConfig;
    
    if (konfig) {
        for (var item in konfig) {
            if (item in config) {
                config[item] = konfig[item];
            }
        }
    }
    
    config.origH = container.height();
    config.origW = container.width();
    
    var effects = {
        circle: {
            grow: function() {
                this.animate({'r': Math.floor(config.nodeRadius * 1.33)},
                             500,
                             'elastic')
                    .attr({'fill': 'darkorange'});
            },
            shrink: function() {
                this.animate({'r': config.nodeRadius},
                             500,
                             'elastic')
                    .attr({'fill': '#057cb8'});
            }
        },
        line: {
            casterGrow: function() {
                paper.getById(this.casterId).attr({'stroke-width': 4, 'stroke' : 'darkorange'});
            },
            casterShrink: function() {
                paper.getById(this.casterId).animate({'stroke' : '#000'}, 100).attr('stroke-width', 3);
            }
        }
    };
    

    var svg;
    var h, w, x, y;
    
    paper.setStart();
    
    function addNode(pos)
    {
        return paper.circle(pos.x, pos.y, 30).attr({
                'fill'          : '#057cb8',
                'stroke-width'  : 0
            }).hover(effects.circle.grow, effects.circle.shrink).toBack().id;
    }
    
    var rootPos = {x: Math.floor(config.origW / 2), y: 50};
    
    globalConfig = {
        rootX   : rootPos.x,
        rootY   : rootPos.y,
        offsetY : 150
    };
    
    var nodes = [];
    
    function bfs(root) {
    
        nodes.push(root);
    
        for (var i = 0; i < nodes.length; ++i) {
    
            var node = nodes[i];
            var children = node.children();
    
            for (var c = 0; c < children.length; ++c) {
                nodes.push(children[c]);
            }
    
        }
    
    }
    
    function bfsRender(root) {
        if (root) {
            paper.setStart();
    
            nodes = [];
            bfs(root);
    
            var row = [];
            var level = 0;
    
            for (var i = 0; i < nodes.length + 1; ++i) {
                var node = null;
                if (i < nodes.length) {
                    
                    node = nodes[i];
        
                    if (node.level() == level) {
                        row.push(node);
                        continue;
                    }
                }
                var config = {};
                for (var key in globalConfig) {
                    if (globalConfig.hasOwnProperty(key)) {
                        config[key] = globalConfig[key];
                    }
                }
    
                var width = container.width() - 80;
    
                if (row.length > 1) {
                    config.offsetX = width / (row.length - 1);               
                    config.startX = 40;
                }
                else {
                    config.offsetX = width/2;
    
                    config.startX = width/2 + 40;
    
                }
                for (var c = 0; c < row.length; ++c) {
                    var pos = {x: config.startX + c * config.offsetX, y: 50 + level * config.offsetY};
                    if (row[c].parent()) {
    
                        var pid = row[c].parent().DOMid;
    
                        var parent = paper.getById(pid);
    
                        var cx = parent.attr('cx');
                        var cy = parent.attr('cy');
                        var seen = paper.path('M' + cx + ',' + cy + 'L' + pos.x + ',' + pos.y).attr('stroke-width', 3)
                            .hover(effects.line.grow, effects.line.shrink);
                        var shadow = paper.path('M' + cx + ',' + cy + 'L' + pos.x + ',' + pos.y).attr({'stroke-width': '15', 'stroke': 'transparent'});
                        shadow.casterId = seen.id;
                        shadow.hover(effects.line.casterGrow, effects.line.casterShrink);
                    }
    
                    row[c].DOMid = addNode(pos);
                }
    
                row = [];
                if (node) {
                    level = node.level();
                    row.push(node);
                }
            }
            
    
        }
        
        for (var j = 0; j < nodes.length; ++j) {
            paper.getById(nodes[j].DOMid).toFront();
        }
        origH = h = container.height();
        origW = w = container.width();
        x = y = 0;
        paper.setViewBox(x, y, w, h);
        svg = paper.setFinish();
    }
    
    bfsRender(t.root);
    var down = 0;
    var downX, downY, dx = 0, dy = 0, setX = 0, setY = 0, mousePosX, mousePosY;
    
    window.addWheelListener(document.getElementById('fbt-container'), function(e) {
    
        if (!down) {
            e.preventDefault();
            var rx = (mousePosX)/origW;
            var ry = (mousePosY)/origH;
            
            var SVGx = ((mousePosX)/origW) * w + x;
            var SVGy = ((mousePosY)/origH) * h + y;

            if (e.deltaY < 0) {
                w = Math.round(w/config.zoomFactor);
                h = Math.round(h/config.zoomFactor);
            }
            else {
                w = Math.round(w * config.zoomFactor);
                h = Math.round(h * config.zoomFactor);
            }
            x = Math.round((SVGx) - rx * w);
            y = Math.round((SVGy) - ry * h);
            
            paper.setViewBox(x, y, Math.round(w), Math.round(h));
        }
    });
    
    container.mousedown(function(e) {
        if (e.which == 1) {
            down = 1;
            downX = e.pageX;
            downY = e.pageY;
        }
    });
    
    container.mousemove(function(e) {
        mousePosX = (e.pageX - Math.round(container.offset().left));
        mousePosY = (e.pageY - Math.round(container.offset().top));
        if (down) {
            
            var curX = e.pageX;
            var curY = e.pageY;
            
            var scale = w/origW;
            
            dx = (curX - downX) * scale;
    
            if (setX !== 0) {
                dx += setX;
            }
    
            dy = (curY - downY) * scale;
    
            if (setY !== 0) {
                dy += setY;
            }
            svg.transform('T' + dx + ',' + dy);
        }
    });
    
    container.mouseup(function() {
        setX = dx;
        setY = dy;
        down = 0;
    });
    
    container.dblclick(function(e) {
        e.preventDefault();
        e.stopPropagation();
        svg.transform('T0,0');
        x = y = dx = dy = setX = setY = 0;
        paper.setViewBox(0, 0, origW, origH);
        h = origH;
        w = origW;
    });
    
    $(window).resize(function() {
        paper.clear();
        paper.setStart();
        bfsRender(t.root);
        svg = paper.setFinish();
        svg.transform('T' + dx + ',' + dy);
    });
}

FBT(document.getElementById('fbt-container'), randTree);
