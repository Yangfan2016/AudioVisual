# AudioVisual

> ### 音频数据可视化插件

#### 功能：
1. 动态可视化音频数据，随音乐起舞
2. 随着音频变化规律振动，感受音乐的力量
3. 敬请期待 ...

### 使用
1. 标签引入
```html
  <script src="./fakepath/AudioVisual.js"></script>
```
2. 实例化
```js
  var av = new AudioVisual(file, audio, canvas[, config]);
```
### 参数

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
            <td>```js{
                isAutoRun: true, // auto play and dance
                isVibrating: false, // launch vibrate
                thickness: 1024, // Must be a power of 2 between 2^5 and 2^15, 32~32768. Defaults to 2048.
            }```</td>
        </tr>
    </tbody>
</table>
