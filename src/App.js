import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import marked from 'marked';
import Prism from 'prismjs';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinimize, faMaximize } from '@fortawesome/free-solid-svg-icons';
import { faFreeCodeCamp } from '@fortawesome/free-brands-svg-icons';

import './styles.scss';

// set options for marked js parser
const renderer = new marked.Renderer();
renderer.code = function (code, lang) {
	const highlitedCode = this.options.highlight(code, lang);

	if (!lang) {
		return `<pre><code>${code}</code></pre>`;
	}

	const langClass = 'language-' + lang;
	return `<pre class="${langClass}"><code class="${langClass}">${highlitedCode}</code></pre>`;
};

marked.setOptions({
	renderer,
	highlight: function (code, lang) {
		try {
			return Prism.highlight(code, Prism.languages[lang], lang)
				.split('\n')
				.map(
					(line, i) =>
						`<span class='editorLineNumber'>${i + 1} | </span>${line}`,
				)
				.join('\n');
		} catch {
			// console.log("catch");
			return code;
		}
	},
});

const Editor = (props) => {
	const { code, setCode, editorMaximize, setEditorMaximize } = props;
	return (
		<Card className={`shadow-sm ${editorMaximize && 'vh-100'}`}>
			<Card.Header className="shadow-sm headerPanel">
				<FontAwesomeIcon className="me-1" icon={faFreeCodeCamp} />
				Editor
				<div
					className="me-1 float-end "
					style={{ cursor: 'pointer' }}
					onClick={() => {
						editorMaximize ? setEditorMaximize(false) : setEditorMaximize(true);
						console.log(editorMaximize);
					}}>
					<FontAwesomeIcon icon={editorMaximize ? faMinimize : faMaximize} />
				</div>
			</Card.Header>
			<textarea
				id="editor"
				className="h-100"
				draggable="true"
				rows="10"
				onChange={(e) => setCode(e.target.value)}
				value={code}></textarea>
		</Card>
	);
};

const Previewer = (props) => {
	const { code, previwerMaximize, setPreviwerMaximize } = props;

	const getMarkdownText = () => {
		const rawMarkup = marked.parse(code);
		const cleanMarkup = DOMPurify.sanitize(rawMarkup, {
			USE_PROFILES: { html: true },
		});
		return { __html: cleanMarkup };
	};

	return (
		<Card className="shadow-sm">
			<Card.Header className="shadow-sm headerPanel">
				<FontAwesomeIcon icon={faFreeCodeCamp} />
				Previewer
				<div
					className="me-1 float-end"
					style={{ cursor: 'pointer' }}
					onClick={() => {
						previwerMaximize
							? setPreviwerMaximize(false)
							: setPreviwerMaximize(true);
						console.log(previwerMaximize);
					}}>
					<FontAwesomeIcon
						className="me-1 float-end"
						icon={previwerMaximize ? faMinimize : faMaximize}
					/>
				</div>
			</Card.Header>
			<Card.Body>
				<div id="preview" dangerouslySetInnerHTML={getMarkdownText()} />
			</Card.Body>
		</Card>
	);
};

const App = () => {
	const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

	const [code, setCode] = useState(placeholder);
	const [editorMaximize, setEditorMaximize] = useState(false);
	const [previwerMaximize, setPreviwerMaximize] = useState(false);

	// toggle state function
	const toggleState = (e) => {
		console.log(e.target);
		// return state ? false : true;
	};

	// adds freeCodeCamp check bundle script
	// useEffect(() => {
	// 	const scriptFCCBundle = document.createElement('script');
	// 	scriptFCCBundle.setAttribute('type', 'text/javascript');
	// 	scriptFCCBundle.src =
	// 		'https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js';
	// 	// scriptFCCBundle.setAttribute('crossorigin', 'anonymous');
	// 	// scriptFCCBundle.setAttribute('referrerpolicy', 'no-referrer');
	// 	document.body.appendChild(scriptFCCBundle);
	// 	return () => {
	// 		document.body.removeChild(scriptFCCBundle);
	// 	};
	// }, []);

	return (
		<Container
			fluid
			className="h-100"
			style={{
				backgroundColor: 'aliceblue',
			}}>
			<Row className="px-5 justify-content-center">
				<Col
					className={`my-3 ${previwerMaximize && 'd-none'}`}
					sm={10}
					md={10}
					lg={10}
					xl={8}>
					<Editor
						code={code}
						setCode={setCode}
						editorMaximize={editorMaximize}
						setEditorMaximize={setEditorMaximize}
						toggleStateFunc={toggleState}
					/>
				</Col>
				<Col
					className={`mb-3 ${editorMaximize && 'd-none'}`}
					sm={12}
					md={12}
					lg={12}
					xl={10}>
					<Previewer
						code={code}
						previwerMaximize={previwerMaximize}
						setPreviwerMaximize={setPreviwerMaximize}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default App;
