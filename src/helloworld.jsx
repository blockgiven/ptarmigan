React.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
);

var Source = React.createClass({
    getInitialState: function() {
	return {
	    content: "Hello world! Hello, React!"
	}
    },

    render: function() {
	return (
	    <pre>{this.state.content}</pre>
	);
    }
});

var source = React.render(
    <Source lang="en" />,
    document.getElementById('source')
);

var Translation = React.createClass({
    getInitialState: function() {
	return {
	    content: ""
	}
    },

    componentDidMount: function() {
	this.setState({
	    content: source.state.content
	});
	$.get(this.props.tmx, function(result) {
	    if (!this.isMounted()) {
		return;
	    }
	    var tmxDoc = $.parseXML(result),
	    $tmx = $(tmxDoc),
	    translation = this,
	    translatedContent = source.state.content;

	    $tmx.find('tu').each(function() {
		$source_tuv = $(this).find('tuv').filter(function() {
		    return $(this).attr('xml:lang') == source.props.lang;
		});
		$translation_tuv = $(this).find('tuv').filter(function() {
		    return $(this).attr('xml:lang') == translation.props.lang;
		});
		if ($source_tuv.length == 0 || $translation_tuv.length == 0) {
		    return;
		}
		$source_tuv.find('seg').contents().each(function(){
		    console.log(this.textContent);
		    translatedContent = translatedContent.replace(new RegExp(this.textContent, 'g'), $translation_tuv.find('seg').text());
		});
		translation.setState({content: translatedContent});
	    });
	}.bind(this));
    },

    render: function() {
	return (
	    <pre>
	      {this.state.content}
	    </pre>
	);
    }
});

React.render(
    <Translation source="source" tmx="https://blockgiven.github.io/ptarmigan/src/helloworld.tmx" lang="fr" />,
    document.getElementById('translation')
);
