<h1>
vite-open <a href="https://npmjs.org/package/vite-open"><img src="https://img.shields.io/badge/npm-v2.1.1-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-296-FFF.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Open any file directly in a Vite dev server.

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i vite-open -g</code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add vite-open -g</code>
</td><td title="Triple click to select and copy paste">
<code>yarn global add vite-open</code>
</td></tr></table>
</h4>

## CLI

<p></p>
<p>
<img width="579.4285714285714" src="cli.png" />
</p>

<h2>Features</h2>
<ul>
<li><strong><em>Zero config, zero setup</em></strong>. Open <code>.js</code> <code>.jsx</code> <code>.ts</code> <code>.tsx</code> <code>.md</code> and <code>.html</code> files directly.</li>
<li><strong><em>Vite</em></strong> configured for development, <strong><em>all ESNext features</em></strong> and accurate sourcemaps.</li>
<li>Strict CORS headers enabling <strong><em>all Web features</em></strong>.</li>
<li>Compile time pattern-based <strong><em>debugging</em></strong> using <a href="https://github.com/stagas/rollup-plugin-debug">rollup-plugin-debug</a>.</li>
<li>Open files in VSCode by <strong><em>clicking links directly</em></strong> in Chrome DevTools using the <a href="https://github.com/generalov/open-in-editor-extension">open-in-editor</a> Chrome extension <em>(installed separately)</em>.</li>
<li><strong><em>QR code</em></strong> display with the external address for easy access by phone.</li>
</ul>

## API

<p>  <details id="ViteServer$23" title="Interface" ><summary><span><a href="#ViteServer$23">#</a></span>  <code><strong>ViteServer</strong></code>     &ndash; ViteServer return object.</summary>  <a href="src/server.ts#L10">src/server.ts#L10</a>  <ul>        <p>  <details id="localAddr$24" title="Property" ><summary><span><a href="#localAddr$24">#</a></span>  <code><strong>localAddr</strong></code>     &ndash; The local address</summary>  <a href="src/server.ts#L12">src/server.ts#L12</a>  <ul><p>string</p>        </ul></details><details id="networkAddr$25" title="Property" ><summary><span><a href="#networkAddr$25">#</a></span>  <code><strong>networkAddr</strong></code>     &ndash; The network address</summary>  <a href="src/server.ts#L14">src/server.ts#L14</a>  <ul><p>string</p>        </ul></details><details id="vite$26" title="Property" ><summary><span><a href="#vite$26">#</a></span>  <code><strong>vite</strong></code>     &ndash; The Vite dev server instance</summary>  <a href="src/server.ts#L16">src/server.ts#L16</a>  <ul><p><span>ViteDevServer</span></p>        </ul></details><details id="log$27" title="Method" ><summary><span><a href="#log$27">#</a></span>  <code><strong>log</strong></code><em>(args)</em>     &ndash; Log function</summary>  <a href="src/server.ts#L18">src/server.ts#L18</a>  <ul>    <p>    <details id="args$29" title="Parameter" ><summary><span><a href="#args$29">#</a></span>  <code><strong>args</strong></code>    </summary>    <ul><p>unknown  []</p>        </ul></details>  <p><strong>log</strong><em>(args)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p></ul></details><details id="Options$1" title="Class" ><summary><span><a href="#Options$1">#</a></span>  <code><strong>Options</strong></code>    </summary>  <a href="src/index.ts#L17">src/index.ts#L17</a>  <ul>        <p>  <details id="constructor$2" title="Constructor" ><summary><span><a href="#constructor$2">#</a></span>  <code><strong>constructor</strong></code><em>()</em>    </summary>    <ul>    <p>  <details id="new Options$3" title="ConstructorSignature" ><summary><span><a href="#new Options$3">#</a></span>  <code><strong>new Options</strong></code><em>()</em>    </summary>    <ul><p><a href="#Options$1">Options</a></p>        </ul></details></p>    </ul></details><details id="file$8" title="Property" ><summary><span><a href="#file$8">#</a></span>  <code><strong>file</strong></code>    </summary>  <a href="src/index.ts#L21">src/index.ts#L21</a>  <ul><p>string</p>        </ul></details><details id="https$10" title="Property" ><summary><span><a href="#https$10">#</a></span>  <code><strong>https</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/index.ts#L27">src/index.ts#L27</a>  <ul><p>boolean</p>        </ul></details><details id="jsx$11" title="Property" ><summary><span><a href="#jsx$11">#</a></span>  <code><strong>jsx</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'react'</code></span>  </summary>  <a href="src/index.ts#L30">src/index.ts#L30</a>  <ul><p>string</p>        </ul></details><details id="log$4" title="Property" ><summary><span><a href="#log$4">#</a></span>  <code><strong>log</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>defaultLog</code></span>  </summary>  <a href="src/index.ts#L18">src/index.ts#L18</a>  <ul><p><details id="__type$5" title="Function" ><summary><span><a href="#__type$5">#</a></span>  <em>(args)</em>    </summary>    <ul>    <p>    <details id="args$7" title="Parameter" ><summary><span><a href="#args$7">#</a></span>  <code><strong>args</strong></code>    </summary>    <ul><p>unknown  []</p>        </ul></details>  <p><strong></strong><em>(args)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p>        </ul></details><details id="noOpen$12" title="Property" ><summary><span><a href="#noOpen$12">#</a></span>  <code><strong>noOpen</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/index.ts#L33">src/index.ts#L33</a>  <ul><p>boolean</p>        </ul></details><details id="quiet$13" title="Property" ><summary><span><a href="#quiet$13">#</a></span>  <code><strong>quiet</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/index.ts#L36">src/index.ts#L36</a>  <ul><p>boolean</p>        </ul></details><details id="responses$14" title="Property" ><summary><span><a href="#responses$14">#</a></span>  <code><strong>responses</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>  <a href="src/index.ts#L38">src/index.ts#L38</a>  <ul><p><span>Record</span>&lt;string, {<p>  <details id="content$17" title="Property" ><summary><span><a href="#content$17">#</a></span>  <code><strong>content</strong></code>    </summary>  <a href="src/index.ts#L38">src/index.ts#L38</a>  <ul><p>string</p>        </ul></details><details id="type$16" title="Property" ><summary><span><a href="#type$16">#</a></span>  <code><strong>type</strong></code>    </summary>  <a href="src/index.ts#L38">src/index.ts#L38</a>  <ul><p>string</p>        </ul></details></p>}&gt;</p>        </ul></details><details id="root$9" title="Property" ><summary><span><a href="#root$9">#</a></span>  <code><strong>root</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'.'</code></span>  </summary>  <a href="src/index.ts#L24">src/index.ts#L24</a>  <ul><p>string</p>        </ul></details><details id="viteOptions$18" title="Property" ><summary><span><a href="#viteOptions$18">#</a></span>  <code><strong>viteOptions</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>  <a href="src/index.ts#L40">src/index.ts#L40</a>  <ul><p><span>Partial</span>&lt;<span>InlineConfig</span>&gt;</p>        </ul></details></p></ul></details><details id="open$19" title="Function" ><summary><span><a href="#open$19">#</a></span>  <code><strong>open</strong></code><em>(options)</em>     &ndash; Open a file in Vite.</summary>  <a href="src/index.ts#L98">src/index.ts#L98</a>  <ul>    <p>    <details id="options$21" title="Parameter" ><summary><span><a href="#options$21">#</a></span>  <code><strong>options</strong></code>     &ndash; Open options</summary>    <ul><p><span>Partial</span>&lt;<a href="#Options$1">Options</a>&gt;</p>        </ul></details>  <p><strong>open</strong><em>(options)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<a href="#ViteServer$23">ViteServer</a>&gt;</ul></p></p>    </ul></details></p>

## Credits

- [@babel/core](https://npmjs.org/package/@babel/core) by [The Babel Team](https://babel.dev/team) &ndash; Babel compiler core.
- [@babel/plugin-proposal-class-properties](https://npmjs.org/package/@babel/plugin-proposal-class-properties) by [The Babel Team](https://babel.dev/team) &ndash; This plugin transforms static class properties as well as properties declared with the property initializer syntax
- [@babel/plugin-proposal-decorators](https://npmjs.org/package/@babel/plugin-proposal-decorators) by [The Babel Team](https://babel.dev/team) &ndash; Compile class and object decorators to ES5
- [@babel/plugin-transform-react-jsx](https://npmjs.org/package/@babel/plugin-transform-react-jsx) by [The Babel Team](https://babel.dev/team) &ndash; Turn JSX into React function calls
- [@babel/plugin-transform-typescript](https://npmjs.org/package/@babel/plugin-transform-typescript) by [The Babel Team](https://babel.dev/team) &ndash; Transform TypeScript into ES.next
- [@rollup/plugin-commonjs](https://npmjs.org/package/@rollup/plugin-commonjs) by [Rich Harris](https://github.com/rollup) &ndash; Convert CommonJS modules to ES2015
- [@stagas/chalk](https://npmjs.org/package/@stagas/chalk) by [@stagas](@stagas/chalk) &ndash; Terminal string styling done right (+ CommonJS build)
- [decarg](https://npmjs.org/package/decarg) by [stagas](https://github.com/stagas) &ndash; decorator based cli arguments parser
- [github-markdown-css](https://npmjs.org/package/github-markdown-css) by [Sindre Sorhus](https://sindresorhus.com) &ndash; The minimal amount of CSS to replicate the GitHub Markdown style
- [open-in-editor-connect](https://npmjs.org/package/open-in-editor-connect) by [Evgeniy V. Generalov](https://github.com/generalov) &ndash; Open in editor middleware
- [qrcode-terminal](https://npmjs.org/package/qrcode-terminal) by [gtanner](https://github.com/gtanner) &ndash; QRCodes, in the terminal
- [rollup-plugin-debug](https://npmjs.org/package/rollup-plugin-debug) by [stagas](https://github.com/stagas) &ndash; Console debug statements that can be pattern toggled at compile time from comments in the code.
- [running-at](https://npmjs.org/package/running-at) by [Maximilian Schiller](https://github.com/BetaHuhn) &ndash; Get local and network ip address
- [vite](https://npmjs.org/package/vite) by [Evan You](https://github.com/vitejs) &ndash; Native-ESM powered web dev build tool
- [vite-plugin-babel](https://npmjs.org/package/vite-plugin-babel) by [Miłosz Mandowski](https://github.com/owlsdepartment) &ndash; Runs Babel in Vite during all commands
- [vite-plugin-markdown](https://npmjs.org/package/vite-plugin-markdown) by [Kengo Hamasaki](https://github.com/hmsk) &ndash; Import markdown files in vite

## Contributing

[Fork](https://github.com/stagas/vite-open/fork) or [edit](https://github.dev/stagas/vite-open) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
