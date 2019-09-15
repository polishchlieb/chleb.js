function oneObject(str) {
    var obj = {}
    str.split(",").forEach(_ => obj[_] = true)
    return obj
}

const voidTag = oneObject('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr')
const specalTag = oneObject('xmp,style,script,noscript,textarea,template,#comment')
const hiddenTag = oneObject('style,script,noscript,template')

var JSXParser = function(s, c, g) {
    if (!(this instanceof JSXParser)) {
        return parse(s, c, g)
    }
    this.input = s
    this.components = c
    this.getOne = g
}

JSXParser.prototype = {
    parse: function() {
        return parse(this.input, this.components, this.getOne)
    }
}
var rsp = /\s/

function parse(string, components, getOne) {
    // advice for the chinese who wrote this, comments in chinese and such a shitty code does not help
    getOne = (getOne === void 666 || getOne === true) // wtf this line somehow does something
    var ret = lexer(string, getOne, components)
    if (getOne) {
        return typeof ret[0] === 'string' ? ret[1] : ret[0]
    }
    return ret
}

function lexer(string, getOne, components) {
    var breakIndex = 120
    var stack = []
    var origString = string
    var origLength = string.length

    stack.last = function() {
        return stack[stack.length - 1]
    }
    var ret = []

    function addNode(node) {
        var p = stack.last()
        if (p && p.children) {
            p.children.push(node)
        } else {
            ret.push(node)
        }
    }

    var lastNode
    do {
        if (--breakIndex === 0) {
            break
        }
        var arr = getCloseTag(string)

        if (arr) { //处理关闭标签
            string = string.replace(arr[0], '')
            const node = stack.pop()

            if (node.node === 'option') {
                node.children = [getText(node)]
            } else if (node.node === 'table') {
                insertTbody(node.children)
            }
            lastNode = null
            if (getOne && ret.length === 1 && !stack.length) {
                return [origString.slice(0, origLength - string.length), ret[0]]
            }
            continue
        }

        var arr = getOpenTag(string, components)
        if (arr) {
            string = string.replace(arr[0], '')
            var node = arr[1]
            addNode(node)
            var selfClose = !!(node.isVoidTag || specalTag[node.node])
            if (!selfClose) {
                stack.push(node)
            }
            if (getOne && selfClose && !stack.length) {
                return [origString.slice(0, origLength - string.length), node]
            }
            lastNode = node
            continue
        }

        var text = ''
        do {
            const index = string.indexOf('<')
            if (index === 0) {
                text += string.slice(0, 1)
                string = string.slice(1)

            } else {
                break
            }
        } while (string.length);

        const index = string.indexOf('<')
        const bindex = string.indexOf('{')
        const aindex = string.indexOf('}')

        let hasJSX = (bindex < aindex) && (index === -1 || bindex < index)
        if (hasJSX) {
            if (bindex !== 0) {
                text += string.slice(0, bindex)
                string = string.slice(bindex)
            }
            addText(lastNode, text, addNode)
            string = string.slice(1)
            var arr = parseCode(string)
            addNode(makeJSX(arr[1]))
            lastNode = false
            string = string.slice(arr[0].length + 1)
        } else {
            if (index === -1) {
                text = string
                string = ''
            } else {
                text += string.slice(0, index)
                string = string.slice(index)
            }
            addText(lastNode, text, addNode)
        }
    } while (string.length);
    return ret
}

function addText(lastNode, text, addNode) {
    if (/\S/.test(text)) {
        if (lastNode && typeof lastNode === 'string') {
            lastNode.text += text
        } else {
            lastNode = text
            addNode(lastNode)
        }
    }
}

function parseCode(string) {
    var word = '',
        braceIndex = 1,
        codeIndex = 0,
        nodes = [],
        quote,
        escape = false,
        state = 'code'
    for (var i = 0, n = string.length; i < n; i++) {
        var c = string.charAt(i),
            next = string.charAt(i + 1)
        switch (state) {
            case 'code':
                if (c === '"' || c === "'") {
                    state = 'string'
                    quote = c
                } else if (c === '{') {
                    braceIndex++
                } else if (c === '}') {
                    braceIndex--
                    if (braceIndex === 0) {
                        collectJSX(string, codeIndex, i, nodes)
                        return [string.slice(0, i), nodes]
                    }
                } else if (c === '<') {
                    var word = '',
                        empty = true ,
                        index = i - 1
                    do {
                        c = string.charAt(index)
                        if (empty && rsp.test(c)) {
                            continue
                        }
                        if (rsp.test(c)) {
                            break
                        }
                        empty = false
                        word = c + word
                        if (word.length > 7) {
                            break
                        }
                    } while (--index >= 0);
                    var chunkString = string.slice(i)
                    if (word === '' || /(=>|return|\{|\(|\[|\,)$/.test(word) && /\<\w/.test(chunkString)) {
                        collectJSX(string, codeIndex, i, nodes)
                        var chunk = lexer(chunkString, true)
                        nodes.push(chunk[1])
                        i += (chunk[0].length - 1)
                        codeIndex = i + 1
                    }
                }
                break
            case 'string':
                if (c == '\\' && (next === '"' || next === "'")) {
                    escape = !escape
                } else if (c === quote && !escape) {
                    state = 'code'
                }
                break
        }
    }
}

function collectJSX(string, codeIndex, i, nodes) {
    var nodeValue = string.slice(codeIndex, i)
    if (/\S/.test(nodeValue)) {
        nodes.push({
            node: '#jsx',
            nodeValue: nodeValue
        })
    }
}

var rtbody = /^(tbody|thead|tfoot)$/

function insertTbody(nodes) {
    var tbody = false
    for (var i = 0, n = nodes.length; i < n; i++) {
        var node = nodes[i]
        if (rtbody.test(node.nodeName)) {
            tbody = false
            continue
        }

        if (node.nodeName === 'tr') {
            if (tbody) {
                nodes.splice(i, 1)
                tbody.children.push(node)
                n--
                i--
            } else {
                tbody = {
                    nodeName: 'tbody',
                    attributes: {},
                    children: [node]
                }
                nodes.splice(i, 1, tbody)
            }
        } else {
            if (tbody) {
                nodes.splice(i, 1)
                tbody.children.push(node)
                n--
                i--
            }
        }
    }
}

function getCloseTag(string) {
    if (string.indexOf("</") === 0) {
        var match = string.match(/\<\/(\w+)>/)
        if (match) {
            var tag = match[1]
            string = string.slice(3 + tag.length)
            return [match[0], {
                node: tag
            }]
        }
    }
    return null
}

// #here
function getOpenTag(string, components) {
    if (string.indexOf("<") === 0) {
        var i = string.indexOf('<!--')
        if (i === 0) {
            var l = string.indexOf('-->')
            if (l === -1) {
                throw 'Comment node is not closed: ' + string.slice(0, 100)
            }
            var node = {
                node: '#comment',
                nodeValue: string.slice(4, l)
            }

            return [string.slice(0, l + 3), node]
        }
        var match = string.match(/\<(\w[^\s\/\>]*)/)
        if (match) {
            var leftContent = match[0],
                tag = match[1]

            if(components && Object.keys(components).includes(tag))
                tag = components[tag]

            var node = {
                node: tag,
                attributes: {},
                children: []
            }

            string = string.replace(leftContent, '')
            var arr = getAttrs(string)
            if (arr) {
                node.attributes = arr[1]
                string = string.replace(arr[0], '')
                leftContent += arr[0]
            }

            if (string[0] === '>') {
                leftContent += '>'
                string = string.slice(1)
                if (voidTag[node.node]) {
                    node.isVoidTag = true
                }
            } else if (string.slice(0, 2) === '/>') {
                leftContent += '/>'
                string = string.slice(2)
                node.isVoidTag = true
            } 

            if (!node.isVoidTag && specalTag[tag]) {
                var closeTag = '</' + tag + '>'
                var j = string.indexOf(closeTag)
                var nodeValue = string.slice(0, j)
                leftContent += nodeValue + closeTag

                node.children.push(nodeValue);
            }

            return [leftContent, node]
        }
    }
}

function getText(node) {
    var ret = ''
    node.children.forEach(function(el) {
        if (typeof el === 'string') {
            ret += el.nodeValue
        } else if (el.children && !hiddenTag[el.node]) {
            ret += getText(el)
        }
    })
    return ret
}

function getAttrs(string) {
    var state = 'AttrNameOrJSX',
        attrName = '',
        attrValue = '',
        quote,
        escape,
        attributes = {}

    for (var i = 0, n = string.length; i < n; i++) {
        var c = string[i]
        switch (state) {
            case 'AttrNameOrJSX':
                if (c === '/' || c === '>') {
                    return [string.slice(0, i), attributes]
                }
                if (rsp.test(c)) {
                    if (attrName) {
                        state = 'AttrEqual'
                    }
                } else if (c === '=') {
                    if (!attrName) {
                        throw 'Attribute name is not specified'
                    }
                    state = 'AttrQuoteOrJSX'
                } else if (c === '{') {
                    state = 'SpreadJSX'
                } else {
                    attrName += c
                }
                break
            case 'AttrEqual':
                if (c === '=') {
                    state = 'AttrQuoteOrJSX'
                }
                break
            case 'AttrQuoteOrJSX':
                if (c === '"' || c === "'") {
                    quote = c
                    state = 'AttrValue'
                    escape = false
                } else if (c === '{') {
                    state = 'JSX'
                }
                break
            case 'AttrValue':
                if (c === '\\') {
                    escape = !escape
                }
                if (c !== quote) {
                    attrValue += c
                } else if (c === quote && !escape) {
                    attributes[attrName] = attrValue
                    attrName = attrValue = ''
                    state = 'AttrNameOrJSX'
                }
                break
            case 'SpreadJSX':
                i += 3
            case 'JSX':
                var arr = parseCode(string.slice(i))
                i += arr[0].length

                attributes[state === 'SpreadJSX' ? 'spreadAttribute' : attrName] = makeJSX(arr[1])
                attrName = attrValue = ''
                state = 'AttrNameOrJSX'
                break
        }
    }
    throw 'The label is not closed'
}

function makeJSX(JSXNode) {
    return JSXNode.length === 1 && JSXNode[0].node === '#jsx' ? JSXNode[0] : { node: '#jsx', nodeValue: JSXNode }
}

export default JSXParser