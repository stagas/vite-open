<h1>
vite-open <a href="https://npmjs.org/package/vite-open"><img src="https://img.shields.io/badge/npm-v1.6.0-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-224-FFF.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Opens a file in a Vite dev server.

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

## API

<p>  <details id="Options$1" title="Class" open><summary><span><a href="#Options$1">#</a></span>  <code><strong>Options</strong></code>    </summary>  <a href="src/index.ts#L14">src/index.ts#L14</a>  <ul>        <p>  <details id="constructor$2" title="Constructor" ><summary><span><a href="#constructor$2">#</a></span>  <code><strong>constructor</strong></code><em>()</em>    </summary>    <ul>    <p>  <details id="new Options$3" title="ConstructorSignature" ><summary><span><a href="#new Options$3">#</a></span>  <code><strong>new Options</strong></code><em>()</em>    </summary>    <ul><p><a href="#Options$1">Options</a></p>        </ul></details></p>    </ul></details><details id="file$8" title="Property" ><summary><span><a href="#file$8">#</a></span>  <code><strong>file</strong></code>    </summary>  <a href="src/index.ts#L18">src/index.ts#L18</a>  <ul><p>string</p>        </ul></details><details id="https$10" title="Property" ><summary><span><a href="#https$10">#</a></span>  <code><strong>https</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/index.ts#L24">src/index.ts#L24</a>  <ul><p>boolean</p>        </ul></details><details id="jsx$11" title="Property" ><summary><span><a href="#jsx$11">#</a></span>  <code><strong>jsx</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'react'</code></span>  </summary>  <a href="src/index.ts#L27">src/index.ts#L27</a>  <ul><p>string</p>        </ul></details><details id="log$4" title="Property" ><summary><span><a href="#log$4">#</a></span>  <code><strong>log</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>defaultLog</code></span>  </summary>  <a href="src/index.ts#L15">src/index.ts#L15</a>  <ul><p><details id="__type$5" title="Function" ><summary><span><a href="#__type$5">#</a></span>  <em>(args)</em>    </summary>    <ul>    <p>    <details id="args$7" title="Parameter" ><summary><span><a href="#args$7">#</a></span>  <code><strong>args</strong></code>    </summary>    <ul><p>unknown  []</p>        </ul></details>  <p><strong></strong><em>(args)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p>        </ul></details><details id="quiet$12" title="Property" ><summary><span><a href="#quiet$12">#</a></span>  <code><strong>quiet</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>false</code></span>  </summary>  <a href="src/index.ts#L30">src/index.ts#L30</a>  <ul><p>boolean</p>        </ul></details><details id="responses$13" title="Property" ><summary><span><a href="#responses$13">#</a></span>  <code><strong>responses</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>  <a href="src/index.ts#L32">src/index.ts#L32</a>  <ul><p><span>Record</span>&lt;string, {<p>  <details id="content$16" title="Property" ><summary><span><a href="#content$16">#</a></span>  <code><strong>content</strong></code>    </summary>  <a href="src/index.ts#L32">src/index.ts#L32</a>  <ul><p>string</p>        </ul></details><details id="type$15" title="Property" ><summary><span><a href="#type$15">#</a></span>  <code><strong>type</strong></code>    </summary>  <a href="src/index.ts#L32">src/index.ts#L32</a>  <ul><p>string</p>        </ul></details></p>}&gt;</p>        </ul></details><details id="root$9" title="Property" ><summary><span><a href="#root$9">#</a></span>  <code><strong>root</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>'.'</code></span>  </summary>  <a href="src/index.ts#L21">src/index.ts#L21</a>  <ul><p>string</p>        </ul></details><details id="viteOptions$17" title="Property" ><summary><span><a href="#viteOptions$17">#</a></span>  <code><strong>viteOptions</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>  <a href="src/index.ts#L34">src/index.ts#L34</a>  <ul><p><span>Partial</span>&lt;<span>InlineConfig</span>&gt;</p>        </ul></details></p></ul></details><details id="open$18" title="Function" open><summary><span><a href="#open$18">#</a></span>  <code><strong>open</strong></code><em>(options)</em>     &ndash; Open a file in Vite.</summary>  <a href="src/index.ts#L91">src/index.ts#L91</a>  <ul>    <p>    <details id="options$20" title="Parameter" ><summary><span><a href="#options$20">#</a></span>  <code><strong>options</strong></code>     &ndash; Open options</summary>    <ul><p><span>Partial</span>&lt;<a href="#Options$1">Options</a>&gt;</p>        </ul></details>  <p><strong>open</strong><em>(options)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<span>ViteServer</span>&gt;</ul></p></p>    </ul></details></p>

## Credits

- [@babel/plugin-transform-react-jsx](https://npmjs.org/package/@babel/plugin-transform-react-jsx) by [The Babel Team](https://babel.dev/team) &ndash; Turn JSX into React function calls
- [@babel/plugin-transform-typescript](https://npmjs.org/package/@babel/plugin-transform-typescript) by [The Babel Team](https://babel.dev/team) &ndash; Transform TypeScript into ES.next
- [@originjs/vite-plugin-commonjs](https://npmjs.org/package/@originjs/vite-plugin-commonjs) by [jiawulin](https://github.com/originjs) &ndash; A vite plugin that support commonjs to esm in vite
- [@stagas/chalk](https://npmjs.org/package/@stagas/chalk) by [@stagas](@stagas/chalk) &ndash; Terminal string styling done right (+ CommonJS build)
- [decarg](https://npmjs.org/package/decarg) by [stagas](https://github.com/stagas) &ndash; decorator based cli arguments parser
- [github-markdown-css](https://npmjs.org/package/github-markdown-css) by [Sindre Sorhus](https://sindresorhus.com) &ndash; The minimal amount of CSS to replicate the GitHub Markdown style
- [qrcode-terminal](https://npmjs.org/package/qrcode-terminal) by [gtanner](https://github.com/gtanner) &ndash; QRCodes, in the terminal
- [running-at](https://npmjs.org/package/running-at) by [Maximilian Schiller](https://github.com/BetaHuhn) &ndash; Get local and network ip address
- [vite](https://npmjs.org/package/vite) by [Evan You](https://github.com/vitejs) &ndash; Native-ESM powered web dev build tool
- [vite-plugin-babel-dev](https://npmjs.org/package/vite-plugin-babel-dev) by [Miłosz Mandowski](https://github.com/owlsdepartment) &ndash; Runs babel during dev serve in Vite
- [vite-plugin-markdown](https://npmjs.org/package/vite-plugin-markdown) by [Kengo Hamasaki](https://github.com/hmsk) &ndash; Import markdown files in vite

## Contributing

[Fork](https://github.com/stagas/vite-open/fork) or [edit](https://github.dev/stagas/vite-open) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
