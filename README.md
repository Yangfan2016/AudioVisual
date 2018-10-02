## AudioVisual

> This a plugin of audio data visualization

![av.gif](https://raw.githubusercontent.com/Yangfan2016/PicBed/master/Blog/audio-visual.gif)  


### Have
- [x] 可视化音频数据
- [x] 自定义渐变色
- [x] 支持两种接入数据方式

### API
check this file: `src/index.ts`


### Example

check this file: `test/index.html`

### Install
1. 标签引入
```html
<script src="./dist/AudioVisual.min.js"></script>
```
2. 实例化（file可选）
```js
var av = new AudioVisual(audio, canvas[, config]);
```

#### Params

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
            <td>object</td>
            <td>参见下面的配置说明 options</td>
        </tr>
    </tbody>
</table>

#### options
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
            <td>isAutoRun</td>
            <td>在音频文件读取完成后立即运行</td>
            <td>boolean</td>
            <td>true</td>
        </tr>
        <tr>
            <td>thickness</td>
            <td>粒度</td>
            <td>number</td>
            <td>默认 2048 范围 32~32768，必须是2的n次方</td>
        </tr>
        <tr>
            <td>colorStops</td>
            <td>渐变色序列</td>
            <td>string[]</td>
            <td>内置默认6种渐变色</td>
        </tr>
        <tr>
            <td>fileElement</td>
            <td>文件控件，获取音频文件的入口</td>
            <td>HTMLInputElement</td>
            <td>可选</td>
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
