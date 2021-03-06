# WISIPOO (Wysiwyg - What you see is what you get)

A rich editor for the cliengo needs. No more, no less.

## Installation

```bash
yarn add https://github.com/Cliengo/wisipoo.git @lexical/react@0.3.3 @lexical/html@0.3.3 lexical@0.3.3
```

## css
include this on your root html file
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Cliengo/wisipoo@latest/demo/src/App.css">
```

## Usage

```javascript
import { Editor } from 'wisipoo';

const [editMode, setEditMode] = useState(false);

const toggleEditMode = () => setEditMode(!editMode);

<Editor
    initialValue=""
    placeholder="" // if initialValue !== "" it will show initialValue always
    onChange={(value) => console.log(value)} // value in html as string
    editMode={editMode}
    handleEditMode={toggleEditMode}
    websiteType={'website' | 'facebook' | 'whatsapp' | 'instagram'}
/>
```

## Contributing

1. Check out repo and create a branch
1. Do your thing
1. Make a PR
1. Get reviewd

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
