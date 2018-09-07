## audio-visual ![NPM version](https://img.shields.io/npm/v/audio-visual.svg?style=flat)

This a plugin of audio data visualization

#### 功能：
1. 动态可视化音频数据，随音乐起舞
2. 敬请期待 ...


### Installation
```bash
$ npm install audio-visual
```

### Example
```js
var audioVisual = require('audio-visual');
```

### API
check this file: `src/index.js`

#### 使用
1. 标签引入
```html
<script src="./fakepath/AudioVisual.js"></script>
```
2. 实例化
```js
var av = new AudioVisual(file, audio, canvas[, config]);
```
#### 参数

<table>
    <thead>
        <tr>
            <th>参数</th> 
            <th>说明</th> 
            <th>类型</th> 
            <th>默认值</th>
        </tr>
    </thead> 
    <tbody>
        <tr>
            <td>file</td>
            <td>音频源</td>
            <td>HTMLInputElement</td>
            <td></td>
        </tr>
        <tr>
            <td>audio</td>
            <td>音频节点</td>
            <td>HTMLAudioElement</td>
            <td></td>
        </tr>
        <tr>
            <td>canvas</td>
            <td>画布</td>
            <td>HTMLCanvasElement</td>
            <td></td>
        </tr>
        <tr>
            <td>config</td>
            <td>配置</td>
            <td>Object</td>
            <td>
              {  
                isAutoRun: true, // auto play and dance  
                isVibrating: false, // launch vibrate  
                thickness: 1024, // Must be a power of 2 between 2^5 and 2^15, 32~32768. Defaults to 2048.  
              }  
          </td>
        </tr>
    </tbody>
</table>


### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT license
Copyright (c) 2018 yangfan2016 &lt;15234408101@163.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor]()
built upon love by [docor](https://github.com/turingou/docor.git) v0.3.0
