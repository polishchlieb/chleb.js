# Troubleshooting

-   ```
    vDom.js:45 Uncaught TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
        at vDom.js:45
        at Array.forEach (<anonymous>)
        at renderNode (vDom.js:45)
        at vDom.js:45
        at Array.forEach (<anonymous>)
        at renderNode (vDom.js:45)
        at renderNode (vDom.js:39)
        at diff (vDom.js:92)
        at Bread.render (Bread.js:9)
        at app.js:5
    ```

    Explicitly parse your value to string:
    `this.a` to ` String(this.a)`