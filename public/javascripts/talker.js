/*!
 * jQuery JavaScript Library v1.3.2
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
 * Revision: 6246
 */
(function(){

var
	window = this,
	undefined,
	_jQuery = window.jQuery,
	_$ = window.$,

	jQuery = window.jQuery = window.$ = function( selector, context ) {
		return new jQuery.fn.init( selector, context );
	},

	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
	isSimple = /^.[^:#\[\.,]*$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		selector = selector || document;

		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			this.context = selector;
			return this;
		}
		if ( typeof selector === "string" ) {
			var match = quickExpr.exec( selector );

			if ( match && (match[1] || !context) ) {

				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				else {
					var elem = document.getElementById( match[3] );

					if ( elem && elem.id != match[3] )
						return jQuery().find( selector );

					var ret = jQuery( elem || [] );
					ret.context = document;
					ret.selector = selector;
					return ret;
				}

			} else
				return jQuery( context ).find( selector );

		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document ).ready( selector );

		if ( selector.selector && selector.context ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return this.setArray(jQuery.isArray( selector ) ?
			selector :
			jQuery.makeArray(selector));
	},

	selector: "",

	jquery: "1.3.2",

	size: function() {
		return this.length;
	},

	get: function( num ) {
		return num === undefined ?

			Array.prototype.slice.call( this ) :

			this[ num ];
	},

	pushStack: function( elems, name, selector ) {
		var ret = jQuery( elems );

		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" )
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		else if ( name )
			ret.selector = this.selector + "." + name + "(" + selector + ")";

		return ret;
	},

	setArray: function( elems ) {
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	index: function( elem ) {
		return jQuery.inArray(
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		var options = name;

		if ( typeof name === "string" )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		return this.each(function(i){
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text !== "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] ) {
			var wrap = jQuery( html, this[0].ownerDocument ).clone();

			if ( this[0].parentNode )
				wrap.insertBefore( this[0] );

			wrap.map(function(){
				var elem = this;

				while ( elem.firstChild )
					elem = elem.firstChild;

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	push: [].push,
	sort: [].sort,
	splice: [].splice,

	find: function( selector ) {
		if ( this.length === 1 ) {
			var ret = this.pushStack( [], "find", selector );
			ret.length = 0;
			jQuery.find( selector, this[0], ret );
			return ret;
		} else {
			return this.pushStack( jQuery.unique(jQuery.map(this, function(elem){
				return jQuery.find( selector, elem );
			})), "find", selector );
		}
	},

	clone: function( events ) {
		var ret = this.map(function(){
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				var html = this.outerHTML;
				if ( !html ) {
					var div = this.ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0];
			} else
				return this.cloneNode(true);
		});

		if ( events === true ) {
			var orig = this.find("*").andSelf(), i = 0;

			ret.find("*").andSelf().each(function(){
				if ( this.nodeName !== orig[i].nodeName )
					return;

				var events = jQuery.data( orig[i], "events" );

				for ( var type in events ) {
					for ( var handler in events[ type ] ) {
						jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
					}
				}

				i++;
			});
		}

		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, jQuery.grep(this, function(elem){
				return elem.nodeType === 1;
			}) ), "filter", selector );
	},

	closest: function( selector ) {
		var pos = jQuery.expr.match.POS.test( selector ) ? jQuery(selector) : null,
			closer = 0;

		return this.map(function(){
			var cur = this;
			while ( cur && cur.ownerDocument ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selector) ) {
					jQuery.data(cur, "closest", closer);
					return cur;
				}
				cur = cur.parentNode;
				closer++;
			}
		});
	},

	not: function( selector ) {
		if ( typeof selector === "string" )
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ), "not", selector );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector === "string" ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		return !!selector && this.is( "." + selector );
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if( jQuery.nodeName( elem, 'option' ) )
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;

				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					if ( index < 0 )
						return null;

					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							value = jQuery(option).val();

							if ( one )
								return value;

							values.push( value );
						}
					}

					return values;
				}

				return (elem.value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if ( typeof value === "number" )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( jQuery.isArray(value) && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		return value === undefined ?
			(this[0] ?
				this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, +i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ),
			"slice", Array.prototype.slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	domManip: function( args, table, callback ) {
		if ( this[0] ) {
			var fragment = (this[0].ownerDocument || this[0]).createDocumentFragment(),
				scripts = jQuery.clean( args, (this[0].ownerDocument || this[0]), fragment ),
				first = fragment.firstChild;

			if ( first )
				for ( var i = 0, l = this.length; i < l; i++ )
					callback.call( root(this[i], first), this.length > 1 || i > 0 ?
							fragment.cloneNode(true) : fragment );

			if ( scripts )
				jQuery.each( scripts, evalScript );
		}

		return this;

		function root( elem, cur ) {
			return table && jQuery.nodeName(elem, "table") && jQuery.nodeName(cur, "tr") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
};

jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if ( typeof target !== "object" && !jQuery.isFunction(target) )
		target = {};

	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		if ( (options = arguments[ i ]) != null )
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				if ( target === copy )
					continue;

				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep,
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	return target;
};

var	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	defaultView = document.defaultView || {},
	toString = Object.prototype.toString;

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isXMLDoc: function( elem ) {
		return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
			!!elem.ownerDocument && jQuery.isXMLDoc( elem.ownerDocument );
	},

	globalEval: function( data ) {
		if ( data && /\S/.test(data) ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.support.scriptEval )
				script.appendChild( document.createTextNode( data ) );
			else
				script.text = data;

			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		} else {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		return typeof value === "number" && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames !== undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		has: function( elem, className ) {
			return elem && jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	swap: function( elem, options, callback ) {
		var old = {};
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" )
					return;

				jQuery.each( which, function() {
					if ( !extra )
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					if ( extra === "margin" )
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					else
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
			}

			if ( elem.offsetWidth !== 0 )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		if ( name == "opacity" && !jQuery.support.opacity ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}

		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle )
				ret = computedStyle.getPropertyValue( name );

			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];


			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context, fragment ) {
		context = context || document;

		if ( typeof context.createElement === "undefined" )
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		if ( !fragment && elems.length === 1 && typeof elems[0] === "string" ) {
			var match = /^<(\w+)\s*\/?>$/.exec(elems[0]);
			if ( match )
				return [ context.createElement( match[1] ) ];
		}

		var ret = [], scripts = [], div = context.createElement("div");

		jQuery.each(elems, function(i, elem){
			if ( typeof elem === "number" )
				elem += '';

			if ( !elem )
				return;

			if ( typeof elem === "string" ) {
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				var tags = elem.replace(/^\s+/, "").substring(0, 10).toLowerCase();

				var wrap =
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					!jQuery.support.htmlSerialize &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				div.innerHTML = wrap[1] + elem + wrap[2];

				while ( wrap[0]-- )
					div = div.lastChild;

				if ( !jQuery.support.tbody ) {

					var hasBody = /<tbody/i.test(elem),
						tbody = !tags.indexOf("<table") && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

						wrap[1] == "<table>" && !hasBody ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					}

				if ( !jQuery.support.leadingWhitespace && /^\s/.test( elem ) )
					div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );

				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.nodeType )
				ret.push( elem );
			else
				ret = jQuery.merge( ret, elem );

		});

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				} else {
					if ( ret[i].nodeType === 1 )
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					fragment.appendChild( ret[i] );
				}
			}

			return scripts;
		}

		return ret;
	},

	attr: function( elem, name, value ) {
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			set = value !== undefined;

		name = notxml && jQuery.props[ name ] || name;

		if ( elem.tagName ) {

			var special = /href|src|style/.test( name );

			if ( name == "selected" && elem.parentNode )
				elem.parentNode.selectedIndex;

			if ( name in elem && notxml && !special ) {
				if ( set ){
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				if ( name == "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );
					return attributeNode && attributeNode.specified
						? attributeNode.value
						: elem.nodeName.match(/(button|input|object|select|textarea)/i)
							? 0
							: elem.nodeName.match(/^(a|area)$/i) && elem.href
								? 0
								: undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				elem.setAttribute( name, "" + value );

			var attr = !jQuery.support.hrefNormalized && notxml && special
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			return attr === null ? undefined : attr;
		}


		if ( !jQuery.support.opacity && name == "opacity" ) {
			if ( set ) {
				elem.zoom = 1;

				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			if( i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		var i = 0, elem, pos = first.length;
		if ( !jQuery.support.getAll ) {
			while ( (elem = second[ i++ ]) != null )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( (elem = second[ i++ ]) != null )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});


var userAgent = navigator.userAgent.toLowerCase();

jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector );

		for ( var i = 0, l = insert.length; i < l; i++ ) {
			var elems = (i > 0 ? this.clone(true) : this).get();
			jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
			ret = ret.concat( elems );
		}

		return this.pushStack( ret, name, selector );
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames, state ) {
		if( typeof state !== "boolean" )
			state = !jQuery.className.has( this, classNames );
		jQuery.className[ state ? "add" : "remove" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
			jQuery( "*", this ).add([this]).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		jQuery(this).children().remove();

		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( !id )
			id = elem[ expando ] = ++uuid;

		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				delete jQuery.cache[ id ][ name ];

				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		} else {
			try {
				delete elem[ expando ];
			} catch(e){
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			delete jQuery.cache[ id ];
		}
	},
	queue: function( elem, type, data ) {
		if ( elem ){

			type = (type || "fx") + "queue";

			var q = jQuery.data( elem, type );

			if ( !q || jQuery.isArray(data) )
				q = jQuery.data( elem, type, jQuery.makeArray(data) );
			else if( data )
				q.push( data );

		}
		return q;
	},

	dequeue: function( elem, type ){
		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		if( !type || type === "fx" )
			fn = queue[0];

		if( fn !== undefined )
			fn.call(elem);
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined )
			return jQuery.queue( this[0], type );

		return this.each(function(){
			var queue = jQuery.queue( this, type, data );

			 if( type == "fx" && queue.length == 1 )
				queue[0].call(this);
		});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	}
});/*!
 * Sizzle CSS Selector Engine - v0.9.3
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 )
		return [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true;

	chunker.lastIndex = 0;

	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );

		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		var ret = seed ?
			{ expr: parts.pop(), set: makeArray(seed) } :
			Sizzle.find( parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context, isXML(context) );
		set = Sizzle.filter( ret.expr, ret.set );

		if ( parts.length > 0 ) {
			checkSet = makeArray(set);
		} else {
			prune = false;
		}

		while ( parts.length ) {
			var cur = parts.pop(), pop = cur;

			if ( !Expr.relative[ cur ] ) {
				cur = "";
			} else {
				pop = parts.pop();
			}

			if ( pop == null ) {
				pop = context;
			}

			Expr.relative[ cur ]( checkSet, pop, isXML(context) );
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, context, results, seed );

		if ( sortOrder ) {
			hasDuplicate = false;
			results.sort(sortOrder);

			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[i-1] ) {
						results.splice(i--, 1);
					}
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;

		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag && !isXML ) {
				part = part.toUpperCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				if ( match[3].match(chunker).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while (node = node.previousSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					if ( type == 'first') return true;
					node = elem;
				case 'last':
					while (node = node.nextSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first == 1 && last == 0 ) {
						return true;
					}

					var doneName = match[0],
						parent = elem.parentNode;

					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}
						parent.sizcache = doneName;
					}

					var diff = elem.nodeIndex - last;
					if ( first == 0 ) {
						return diff == 0;
					} else {
						return ( diff % first == 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

try {
	Array.prototype.slice.call( document.documentElement.childNodes );

} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.selectNode(a);
		aRange.collapse(true);
		bRange.selectNode(b);
		bRange.collapse(true);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

(function(){
	var form = document.createElement("form"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<input name='" + id + "'/>";

	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
})();

(function(){

	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}

	Sizzle = function(query, context, extra, seed){
		context = context || document;

		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}

		return oldSizzle(query, context, extra, seed);
	};

	Sizzle.find = oldSizzle.find;
	Sizzle.filter = oldSizzle.filter;
	Sizzle.selectors = oldSizzle.selectors;
	Sizzle.matches = oldSizzle.matches;
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	if ( div.getElementsByClassName("e").length === 0 )
		return;

	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 )
		return;

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ){
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ) {
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && isXML( elem.ownerDocument );
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

jQuery.find = Sizzle;
jQuery.filter = Sizzle.filter;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;

Sizzle.selectors.filters.hidden = function(elem){
	return elem.offsetWidth === 0 || elem.offsetHeight === 0;
};

Sizzle.selectors.filters.visible = function(elem){
	return elem.offsetWidth > 0 || elem.offsetHeight > 0;
};

Sizzle.selectors.filters.animated = function(elem){
	return jQuery.grep(jQuery.timers, function(fn){
		return elem === fn.elem;
	}).length;
};

jQuery.multiFilter = function( expr, elems, not ) {
	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return Sizzle.matches(expr, elems);
};

jQuery.dir = function( elem, dir ){
	var matched = [], cur = elem[dir];
	while ( cur && cur != document ) {
		if ( cur.nodeType == 1 )
			matched.push( cur );
		cur = cur[dir];
	}
	return matched;
};

jQuery.nth = function(cur, result, dir, elem){
	result = result || 1;
	var num = 0;

	for ( ; cur; cur = cur[dir] )
		if ( cur.nodeType == 1 && ++num == result )
			break;

	return cur;
};

jQuery.sibling = function(n, elem){
	var r = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType == 1 && n != elem )
			r.push( n );
	}

	return r;
};

return;

window.Sizzle = Sizzle;

})();
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		if ( elem.setInterval && elem != window )
			elem = window;

		if ( !handler.guid )
			handler.guid = this.guid++;

		if ( data !== undefined ) {
			var fn = handler;

			handler = this.proxy( fn );

			handler.data = data;
		}

		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply(arguments.callee.elem, arguments) :
					undefined;
			});
		handle.elem = elem;

		jQuery.each(types.split(/\s+/), function(index, type) {
			var namespaces = type.split(".");
			type = namespaces.shift();
			handler.type = namespaces.slice().sort().join(".");

			var handlers = events[type];

			if ( jQuery.event.specialAll[type] )
				jQuery.event.specialAll[type].setup.call(elem, data, namespaces);

			if (!handlers) {
				handlers = events[type] = {};

				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false ) {
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			handlers[handler.guid] = handler;

			jQuery.event.global[type] = true;
		});

		elem = null;
	},

	guid: 1,
	global: {},

	remove: function(elem, types, handler) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			if ( types === undefined || (typeof types === "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				jQuery.each(types.split(/\s+/), function(index, type){
					var namespaces = type.split(".");
					type = namespaces.shift();
					var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

					if ( events[type] ) {
						if ( handler )
							delete events[type][handler.guid];

						else
							for ( var handle in events[type] )
								if ( namespace.test(events[type][handle].type) )
									delete events[type][handle];

						if ( jQuery.event.specialAll[type] )
							jQuery.event.specialAll[type].teardown.call(elem, namespaces);

						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem, namespaces) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	trigger: function( event, data, elem, bubbling ) {
		var type = event.type || event;

		if( !bubbling ){
			event = typeof event === "object" ?
				event[expando] ? event :
				jQuery.extend( jQuery.Event(type), event ) :
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			if ( !elem ) {
				event.stopPropagation();
				if ( this.global[type] )
					jQuery.each( jQuery.cache, function(){
						if ( this.events && this.events[type] )
							jQuery.event.trigger( event, data, this.handle.elem );
					});
			}


			if ( !elem || elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;

			event.result = undefined;
			event.target = elem;

			data = jQuery.makeArray(data);
			data.unshift( event );
		}

		event.currentTarget = elem;

		var handle = jQuery.data(elem, "handle");
		if ( handle )
			handle.apply( elem, data );

		if ( (!elem[type] || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
			event.result = false;

		if ( !bubbling && elem[type] && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
			this.triggered = true;
			try {
				elem[ type ]();
			} catch (e) {}
		}

		this.triggered = false;

		if ( !event.isPropagationStopped() ) {
			var parent = elem.parentNode || elem.ownerDocument;
			if ( parent )
				jQuery.event.trigger(event, data, parent, true);
		}
	},

	handle: function(event) {
		var all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		var namespaces = event.type.split(".");
		event.type = namespaces.shift();

		all = !namespaces.length && !event.exclusive;

		var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			if ( all || namespace.test(handler.type) ) {
				event.handler = handler;
				event.data = handler.data;

				var ret = handler.apply(this, arguments);

				if( ret !== undefined ){
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if( event.isImmediatePropagationStopped() )
					break;

			}
		}
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function(event) {
		if ( event[expando] )
			return event;

		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ){
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		proxy = proxy || function(){ return fn.apply(this, arguments); };
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		return proxy;
	},

	special: {
		ready: {
			setup: bindReady,
			teardown: function() {}
		}
	},

	specialAll: {
		live: {
			setup: function( selector, namespaces ){
				jQuery.event.add( this, namespaces[0], liveHandler );
			},
			teardown:  function( namespaces ){
				if ( namespaces.length ) {
					var remove = 0, name = RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");

					jQuery.each( (jQuery.data(this, "events").live || {}), function(){
						if ( name.test(this.type) )
							remove++;
					});

					if ( remove < 1 )
						jQuery.event.remove( this, namespaces[0], liveHandler );
				}
			}
		}
	}
};

jQuery.Event = function( src ){
	if( !this.preventDefault )
		return new jQuery.Event(src);

	if( src && src.type ){
		this.originalEvent = src;
		this.type = src.type;
	}else
		this.type = src;

	this.timeStamp = now();

	this[expando] = true;
};

function returnFalse(){
	return false;
}
function returnTrue(){
	return true;
}

jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		if (e.preventDefault)
			e.preventDefault();
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		if (e.stopPropagation)
			e.stopPropagation();
		e.cancelBubble = true;
	},
	stopImmediatePropagation:function(){
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};
var withinElement = function(event) {
	var parent = event.relatedTarget;
	while ( parent && parent != this )
		try { parent = parent.parentNode; }
		catch(e) { parent = this; }

	if( parent != this ){
		event.type = event.data;
		jQuery.event.handle.apply( this, arguments );
	}
};

jQuery.each({
	mouseover: 'mouseenter',
	mouseout: 'mouseleave'
}, function( orig, fix ){
	jQuery.event.special[ fix ] = {
		setup: function(){
			jQuery.event.add( this, orig, withinElement, fix );
		},
		teardown: function(){
			jQuery.event.remove( this, orig, withinElement );
		}
	};
});

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if( this[0] ){
			var event = jQuery.Event(type);
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		var args = arguments, i = 1;

		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			event.preventDefault();

			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		return this.mouseenter(fnOver).mouseleave(fnOut);
	},

	ready: function(fn) {
		bindReady();

		if ( jQuery.isReady )
			fn.call( document, jQuery );

		else
			jQuery.readyList.push( fn );

		return this;
	},

	live: function( type, fn ){
		var proxy = jQuery.event.proxy( fn );
		proxy.guid += this.selector + type;

		jQuery(document).bind( liveConvert(type, this.selector), this.selector, proxy );

		return this;
	},

	die: function( type, fn ){
		jQuery(document).unbind( liveConvert(type, this.selector), fn ? { guid: fn.guid + this.selector + type } : null );
		return this;
	}
});

function liveHandler( event ){
	var check = RegExp("(^|\\.)" + event.type + "(\\.|$)"),
		stop = true,
		elems = [];

	jQuery.each(jQuery.data(this, "events").live || [], function(i, fn){
		if ( check.test(fn.type) ) {
			var elem = jQuery(event.target).closest(fn.data)[0];
			if ( elem )
				elems.push({ elem: elem, fn: fn });
		}
	});

	elems.sort(function(a,b) {
		return jQuery.data(a.elem, "closest") - jQuery.data(b.elem, "closest");
	});

	jQuery.each(elems, function(){
		if ( this.fn.call(this.elem, event, this.fn.data) === false )
			return (stop = false);
	});

	return stop;
}

function liveConvert(type, selector){
	return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "|")].join(".");
}

jQuery.extend({
	isReady: false,
	readyList: [],
	ready: function() {
		if ( !jQuery.isReady ) {
			jQuery.isReady = true;

			if ( jQuery.readyList ) {
				jQuery.each( jQuery.readyList, function(){
					this.call( document, jQuery );
				});

				jQuery.readyList = null;
			}

			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			jQuery.ready();
		}, false );

	} else if ( document.attachEvent ) {
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				jQuery.ready();
			}
		});

		if ( document.documentElement.doScroll && window == window.top ) (function(){
			if ( jQuery.isReady ) return;

			try {
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			jQuery.ready();
		})();
	}

	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
	"change,select,submit,keydown,keypress,keyup,error").split(","), function(i, name){

	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

jQuery( window ).bind( 'unload', function(){
	for ( var id in jQuery.cache )
		if ( id != 1 && jQuery.cache[ id ].handle )
			jQuery.event.remove( jQuery.cache[ id ].handle.elem );
});
(function(){

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + (new Date).getTime();

	div.style.display = "none";
	div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		leadingWhitespace: div.firstChild.nodeType == 3,

		tbody: !div.getElementsByTagName("tbody").length,

		objectAll: !!div.getElementsByTagName("object")[0]
			.getElementsByTagName("*").length,

		htmlSerialize: !!div.getElementsByTagName("link").length,

		style: /red/.test( a.getAttribute("style") ),

		hrefNormalized: a.getAttribute("href") === "/a",

		opacity: a.style.opacity === "0.5",

		cssFloat: !!a.style.cssFloat,

		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e){}

	root.insertBefore( script, root.firstChild );

	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function(){
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", arguments.callee);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	jQuery(function(){
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';
	});
})();

var styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat";

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	"float": styleFloat,
	cssFloat: styleFloat,
	styleFloat: styleFloat,
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	tabindex: "tabIndex"
};
jQuery.fn.extend({
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url !== "string" )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		var type = "GET";

		if ( params )
			if ( jQuery.isFunction( params ) ) {
				callback = params;
				params = null;

			} else if( typeof params === "object" ) {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				if ( status == "success" || status == "notmodified" )
					self.html( selector ?
						jQuery("<div/>")
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							.find(selector) :

						res.responseText );

				if( callback )
					self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password|search/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = now();

jQuery.extend({

	get: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		xhr:function(){
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	lastModified: {},

	ajax: function( s ) {
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		if ( s.data && s.processData && typeof s.data !== "string" )
			s.data = jQuery.param(s.data);

		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			s.dataType = "script";

			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			s.data = null;
		}

		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec( s.url );

		if ( s.dataType == "script" && type == "GET" && parts
			&& ( parts[1] && parts[1] != location.protocol || parts[2] != location.host )){

			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			if ( !jsonp ) {
				var done = false;

				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();

						script.onload = script.onreadystatechange = null;
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			return undefined;
		}

		var requestDone = false;

		var xhr = s.xhr();

		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		try {
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		var onreadystatechange = function(isTimeout){
			if (xhr.readyState == 0) {
				if (ival) {
					clearInterval(ival);
					ival = null;
					if ( s.global && ! --jQuery.active )
						jQuery.event.trigger( "ajaxStop" );
				}
			} else if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" ? "timeout" :
					!jQuery.httpSuccess( xhr ) ? "error" :
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) ? "notmodified" :
					"success";

				if ( status == "success" ) {
					try {
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(e) {
						status = "parsererror";
					}
				}

				if ( status == "success" ) {
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				complete();

				if ( isTimeout )
					xhr.abort();

				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			var ival = setInterval(onreadystatechange, 13);

			if ( s.timeout > 0 )
				setTimeout(function(){
					if ( xhr && !requestDone )
						onreadystatechange( "timeout" );
				}, s.timeout);
		}

		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		if ( !s.async )
			onreadystatechange();

		function success(){
			if ( s.success )
				s.success( data, status );

			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			if ( s.complete )
				s.complete(xhr, status);

			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		if ( s.error ) s.error( xhr, status, e );

		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	active: 0,

	httpSuccess: function( xhr ) {
		try {
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
		} catch(e){}
		return false;
	},

	httpNotModified: function( xhr, url ) {
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			return xhr.status == 304 || xhrRes == jQuery.lastModified[url];
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";

		if( s && s.dataFilter )
			data = s.dataFilter( data, type );

		if( typeof data === "string" ){

			if ( type == "script" )
				jQuery.globalEval( data );

			if ( type == "json" )
				data = window["eval"]("(" + data + ")");
		}

		return data;
	},

	param: function( a ) {
		var s = [ ];

		function add( key, value ){
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		};

		if ( jQuery.isArray(a) || a.jquery )
			jQuery.each( a, function(){
				add( this.name, this.value );
			});

		else
			for ( var j in a )
				if ( jQuery.isArray(a[j]) )
					jQuery.each( a[j], function(){
						add( j, this );
					});
				else
					add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );

		return s.join("&").replace(/%20/g, "+");
	}

});
var elemdisplay = {},
	timerId,
	fxAttrs = [
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		[ "opacity" ]
	];

function genFx( type, num ){
	var obj = {};
	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
		obj[ this ] = type;
	});
	return obj;
}

jQuery.fn.extend({
	show: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("show", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var tagName = this[i].tagName, display;

					if ( elemdisplay[ tagName ] ) {
						display = elemdisplay[ tagName ];
					} else {
						var elem = jQuery("<" + tagName + " />").appendTo("body");

						display = elem.css("display");
						if ( display === "none" )
							display = "block";

						elem.remove();

						elemdisplay[ tagName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = jQuery.data(this[i], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("hide", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" )
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
			}

			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = "none";
			}

			return this;
		}
	},

	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		var bool = typeof fn === "boolean";

		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn == null || bool ?
				this.each(function(){
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				}) :
				this.animate(genFx("toggle", 3), fn, fn2);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){

			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( ( p == "height" || p == "width" ) && this.style ) {
					opt.display = jQuery.css(this, "display");

					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			return true;
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ){
	jQuery.fn[ name ] = function( speed, callback ){
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	update: function(){
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		if ( ( this.prop == "height" || this.prop == "width" ) && this.elem.style )
			this.elem.style.display = "block";
	},

	cur: function(force){
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( timerId );
					timerId = undefined;
				}
			}, 13);
		}
	},

	show: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());

		jQuery(this.elem).show();
	},

	hide: function(){
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		this.custom(this.cur(), 0);
	},

	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					this.elem.style.overflow = this.options.overflow;

					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				if ( this.options.hide )
					jQuery(this.elem).hide();

				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);

				this.options.complete.call( this.elem );
			}

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		_default: 400
	},
	step: {

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			else
				fx.elem[ fx.prop ] = fx.now;
		}
	}
});
if ( document.documentElement["getBoundingClientRect"] )
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		var box  = this[0].getBoundingClientRect(), doc = this[0].ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		return { top: top, left: left };
	};
else
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		jQuery.offset.initialized || jQuery.offset.initialize();

		var elem = this[0], offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView.getComputedStyle(elem, null),
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			computedStyle = defaultView.getComputedStyle(elem, null);
			top -= elem.scrollTop, left -= elem.scrollLeft;
			if ( elem === offsetParent ) {
				top += elem.offsetTop, left += elem.offsetLeft;
				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
					top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
					left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}
			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
				top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
				left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
			top  += body.offsetTop,
			left += body.offsetLeft;

		if ( prevComputedStyle.position === "fixed" )
			top  += Math.max(docElem.scrollTop, body.scrollTop),
			left += Math.max(docElem.scrollLeft, body.scrollLeft);

		return { top: top, left: left };
	};

jQuery.offset = {
	initialize: function() {
		if ( this.initialized ) return;
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';

		rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
		for ( prop in rules ) container.style[prop] = rules[prop];

		container.innerHTML = html;
		body.insertBefore(container, body.firstChild);
		innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		body.style.marginTop = '1px';
		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
		body.style.marginTop = bodyMarginTop;

		body.removeChild(container);
		this.initialized = true;
	},

	bodyOffset: function(body) {
		jQuery.offset.initialized || jQuery.offset.initialize();
		var top = body.offsetTop, left = body.offsetLeft;
		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset )
			top  += parseInt( jQuery.curCSS(body, 'marginTop',  true), 10 ) || 0,
			left += parseInt( jQuery.curCSS(body, 'marginLeft', true), 10 ) || 0;
		return { top: top, left: left };
	}
};


jQuery.fn.extend({
	position: function() {
		var left = 0, top = 0, results;

		if ( this[0] ) {
			var offsetParent = this.offsetParent(),

			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			offset.top  -= num( this, 'marginTop'  );
			offset.left -= num( this, 'marginLeft' );

			parentOffset.top  += num( offsetParent, 'borderTopWidth'  );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		var offsetParent = this[0].offsetParent || document.body;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;

	jQuery.fn[ method ] = function(val) {
		if (!this[0]) return null;

		return val !== undefined ?

			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom", // bottom or right
		lower = name.toLowerCase();

	jQuery.fn["inner" + name] = function(){
		return this[0] ?
			jQuery.css( this[0], lower, false, "padding" ) :
			null;
	};

	jQuery.fn["outer" + name] = function(margin) {
		return this[0] ?
			jQuery.css( this[0], lower, false, margin ? "margin" : "border" ) :
			null;
	};

	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		return this[0] == window ?
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] ||
			document.body[ "client" + name ] :

			this[0] == document ?
				Math.max(
					document.documentElement["client" + name],
					document.body["scroll" + name], document.documentElement["scroll" + name],
					document.body["offset" + name], document.documentElement["offset" + name]
				) :

				size === undefined ?
					(this.length ? jQuery.css( this[0], type ) : null) :

					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
})();
/*
 * jQuery UI 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
;jQuery.ui || (function($) {

var _remove = $.fn.remove,
	isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);

$.ui = {
	version: "1.7.1",

	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set || !instance.element[0].parentNode) { return; }

			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	},

	contains: function(a, b) {
		return document.compareDocumentPosition
			? a.compareDocumentPosition(b) & 16
			: a !== b && a.contains(b);
	},

	hasScroll: function(el, a) {

		if ($(el).css('overflow') == 'hidden') { return false; }

		var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
			has = false;

		if (el[scroll] > 0) { return true; }

		el[scroll] = 1;
		has = (el[scroll] > 0);
		el[scroll] = 0;
		return has;
	},

	isOverAxis: function(x, reference, size) {
		return (x > reference) && (x < (reference + size));
	},

	isOver: function(y, x, top, left, height, width) {
		return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
	},

	keyCode: {
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
};

if (isFF2) {
	var attr = $.attr,
		removeAttr = $.fn.removeAttr,
		ariaNS = "http://www.w3.org/2005/07/aaa",
		ariaState = /^aria-/,
		ariaRole = /^wairole:/;

	$.attr = function(elem, name, value) {
		var set = value !== undefined;

		return (name == 'role'
			? (set
				? attr.call(this, elem, name, "wairole:" + value)
				: (attr.apply(this, arguments) || "").replace(ariaRole, ""))
			: (ariaState.test(name)
				? (set
					? elem.setAttributeNS(ariaNS,
						name.replace(ariaState, "aaa:"), value)
					: attr.call(this, elem, name.replace(ariaState, "aaa:")))
				: attr.apply(this, arguments)));
	};

	$.fn.removeAttr = function(name) {
		return (ariaState.test(name)
			? this.each(function() {
				this.removeAttributeNS(ariaNS, name.replace(ariaState, ""));
			}) : removeAttr.call(this, name));
	};
}

$.fn.extend({
	remove: function() {
		$("*", this).add(this).each(function() {
			$(this).triggerHandler("remove");
		});
		return _remove.apply(this, arguments );
	},

	enableSelection: function() {
		return this
			.attr('unselectable', 'off')
			.css('MozUserSelect', '')
			.unbind('selectstart.ui');
	},

	disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},

	scrollParent: function() {
		var scrollParent;
		if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	}
});


$.extend($.expr[':'], {
	data: function(elem, i, match) {
		return !!$.data(elem, match[3]);
	},

	focusable: function(element) {
		var nodeName = element.nodeName.toLowerCase(),
			tabIndex = $.attr(element, 'tabindex');
		return (/input|select|textarea|button|object/.test(nodeName)
			? !element.disabled
			: 'a' == nodeName || 'area' == nodeName
				? element.href || !isNaN(tabIndex)
				: !isNaN(tabIndex))
			&& !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
	},

	tabbable: function(element) {
		var tabIndex = $.attr(element, 'tabindex');
		return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable');
	}
});


function getter(namespace, plugin, method, args) {
	function getMethods(type) {
		var methods = $[namespace][plugin][type] || [];
		return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
	}

	var methods = getMethods('getter');
	if (args.length == 1 && typeof args[0] == 'string') {
		methods = methods.concat(getMethods('getterSetter'));
	}
	return ($.inArray(method, methods) != -1);
}

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];

	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);

		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		if (isMethodCall && getter(namespace, name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args)
				: undefined);
		}

		return this.each(function() {
			var instance = $.data(this, name);

			(!instance && !isMethodCall &&
				$.data(this, name, new $[namespace][name](this, options))._init());

			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};

	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;

		this.namespace = namespace;
		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = namespace + '-' + name;

		this.options = $.extend({},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);

		this.element = $(element)
			.bind('setData.' + name, function(event, key, value) {
				if (event.target == element) {
					return self._setData(key, value);
				}
			})
			.bind('getData.' + name, function(event, key) {
				if (event.target == element) {
					return self._getData(key);
				}
			})
			.bind('remove', function() {
				return self.destroy();
			});
	};

	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);

	$[namespace][name].getterSetter = 'option';
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled');
	},

	option: function(key, value) {
		var options = key,
			self = this;

		if (typeof key == "string") {
			if (value === undefined) {
				return this._getData(key);
			}
			options = {};
			options[key] = value;
		}

		$.each(options, function(key, value) {
			self._setData(key, value);
		});
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;

		if (key == 'disabled') {
			this.element
				[value ? 'addClass' : 'removeClass'](
					this.widgetBaseClass + '-disabled' + ' ' +
					this.namespace + '-state-disabled')
				.attr("aria-disabled", value);
		}
	},

	enable: function() {
		this._setData('disabled', false);
	},
	disable: function() {
		this._setData('disabled', true);
	},

	_trigger: function(type, event, data) {
		var callback = this.options[type],
			eventName = (type == this.widgetEventPrefix
				? type : this.widgetEventPrefix + type);

		event = $.Event(event);
		event.type = eventName;

		if (event.originalEvent) {
			for (var i = $.event.props.length, prop; i;) {
				prop = $.event.props[--i];
				event[prop] = event.originalEvent[prop];
			}
		}

		this.element.trigger(event, data);

		return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false
			|| event.isDefaultPrevented());
	}
};

$.widget.defaults = {
	disabled: false
};



$.ui.mouse = {
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if(self._preventClickEvent) {
					self._preventClickEvent = false;
					event.stopImmediatePropagation();
					return false;
				}
			});

		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}

		this.started = false;
	},

	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);

		($.browser.msie
			&& this.element.attr('unselectable', this._mouseUnselectable));
	},

	_mouseDown: function(event) {
		event.originalEvent = event.originalEvent || {};
		if (event.originalEvent.mouseHandled) { return; }

		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		($.browser.safari || event.preventDefault());

		event.originalEvent.mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		if ($.browser.msie && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;
			this._preventClickEvent = (event.target == this._mouseDownEvent.target);
			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 1,
	delay: 0
};

})(jQuery);
/*
 * jQuery UI Draggable 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.draggable", $.extend({}, $.ui.mouse, {

	_init: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		this.helper = this._createHelper(event);

		this._cacheHelperProportions();

		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		this._cacheMargins();

		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		this.offset = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		if(o.cursorAt)
			this._adjustOffsetFromHelper(o.cursorAt);

		if(o.containment)
			this._setContainment();

		this._trigger("start", event);

		this._cacheHelperProportions();

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!noPropagation) {
			var ui = this._uiHash();
			this._trigger('drag', event, ui);
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				self._trigger("stop", event);
				self._clear();
			});
		} else {
			this._trigger("stop", event);
			this._clear();
		}

		return false;
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if(obj.left != undefined) this.offset.click.left = obj.left + this.margins.left;
		if(obj.right != undefined) this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		if(obj.top != undefined) this.offset.click.top = obj.top + this.margins.top;
		if(obj.bottom != undefined) this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
	},

	_getParentOffset: function() {

		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var ce = $(o.containment)[0]; if(!ce) return;
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		this.helper = null;
		this.cancelHelperRemoval = false;
	},


	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			absolutePosition: this.positionAbs, //deprecated
			offset: this.positionAbs
		};
	}

}));

$.extend($.ui.draggable, {
	version: "1.7.1",
	eventPrefix: "drag",
	defaults: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		cancel: ":input,option",
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		delay: 0,
		distance: 1,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	}
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable._refreshItems();	//Do a one-time refresh at start to refresh the containerCache
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				if(this.shouldRevert) this.instance.options.revert = true;

				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {

			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {

				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					this.instance.options.revert = false;

					this.instance._trigger('out', event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "iframeFix", {
	start: function(event, ui) {
		var o = $(this).data('draggable').options;
		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});
	},
	stop: function(event, ui) {
		$("div.ui-draggable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack.group)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || o.stack.min) - (parseInt($(b).css("zIndex"),10) || o.stack.min);
		});

		$(group).each(function(i) {
			this.style.zIndex = o.stack.min + i;
		});

		this[0].style.zIndex = o.stack.min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
/*
 * jQuery UI Droppable 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 */
(function($) {

$.widget("ui.droppable", {

	_init: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.options.accept = this.options.accept && $.isFunction(this.options.accept) ? this.options.accept : function(d) {
			return d.is(accept);
		};

		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		$.ui.ddmanager.droppables[this.options.scope] = $.ui.ddmanager.droppables[this.options.scope] || [];
		$.ui.ddmanager.droppables[this.options.scope].push(this);

		(this.options.addClasses && this.element.addClass("ui-droppable"));

	},

	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("ui-droppable ui-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");
	},

	_setData: function(key, value) {

		if(key == 'accept') {
			this.options.accept = value && $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		} else {
			$.widget.prototype._setData.apply(this, arguments);
		}

	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('activate', event, this.ui(draggable)));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.options.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.options.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(inst.options.greedy && $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)) {
				childrenIntersection = true; return false;
			}
		});
		if(childrenIntersection) return false;

		if(this.options.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			absolutePosition: c.positionAbs, //deprecated
			offset: c.positionAbs
		};
	}

});

$.extend($.ui.droppable, {
	version: "1.7.1",
	eventPrefix: 'drop',
	defaults: {
		accept: '*',
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: 'default',
		tolerance: 'intersect'
	}
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l < x1 && x2 < r
				&& t < y1 && y2 < b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].options.accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this._drop.call(this, event);

			if (!this.options.disabled && this.visible && this.options.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	drag: function(draggable, event) {

		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);


		$.each($.ui.ddmanager.droppables[draggable.options.scope], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(droppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	}
};

})(jQuery);
/*
 * jQuery UI Resizable 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.resizable", $.extend({}, $.ui.mouse, {

	_init: function() {

		var self = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			if (/relative/.test(this.element.css('position')) && $.browser.opera)
				this.element.css({ position: 'relative', top: 'auto', left: 'auto' });

			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			this.originalElement.css({ margin: this.originalElement.css('margin') });

			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				if(/sw|se|ne|nw/.test(handle)) axis.css({ zIndex: ++o.zIndex });

				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				if(!$(this.handles[i]).length)
					continue;

			}
		};

		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		this._handles.mouseover(function() {
			if (!self.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				self.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.hover(function() {
					$(this).removeClass("ui-resizable-autohide");
					self._handles.show();
				},
				function(){
					if (!self.resizing) {
						$(this).addClass("ui-resizable-autohide");
						self._handles.hide();
					}
				});
		}

		this._mouseInit();

	},

	destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			wrapper.parent().append(
				this.originalElement.css({
					position: wrapper.css('position'),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css('top'),
					left: wrapper.css('left')
				})
			).end().remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

	},

	_mouseCapture: function(event) {

		var handle = false;
		for(var i in this.handles) {
			if($(this.handles[i])[0] == event.target) handle = true;
		}

		return this.options.disabled || !!handle;

	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		if ($.browser.opera && (/relative/).test(el.css('position')))
			el.css({ position: 'relative', top: 'auto', left: 'auto' });

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

	    var cursor = $('.ui-resizable-' + this.axis).css('cursor');
	    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		var el = this.helper, o = this.options, props = {},
			self = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, self = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
						soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
							soffsetw = ista ? 0 : self.sizeDiff.width;

			var s = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
				left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
				top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			self.helper.height(self.size.height);
			self.helper.width(self.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (data.height) data.width = (csize.height * this.aspectRatio);
		else if (data.width) data.height = (csize.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this.options, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
				continue;

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
			pxyoffset = ( ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

}));

$.extend($.ui.resizable, {
	version: "1.7.1",
	eventPrefix: "resize",
	defaults: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		cancel: ":input,option",
		containment: false,
		delay: 0,
		distance: 1,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	}
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function(event, ui) {

		var self = $(this).data("resizable"), o = self.options;

		_store = function(exp) {
			$(exp).each(function() {
				$(this).data("resizable-alsoresize", {
					width: parseInt($(this).width(), 10), height: parseInt($(this).height(), 10),
					left: parseInt($(this).css('left'), 10), top: parseInt($(this).css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0];	_store(o.alsoResize); }
			else { $.each(o.alsoResize, function(exp, c) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function(event, ui){
		var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

		var delta = {
			height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
			top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
		},

		_alsoResize = function(exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, css = c && c.length ? c : ['width', 'height', 'top', 'left'];

				$.each(css || ['width', 'height', 'top', 'left'], function(i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				if (/relative/.test(el.css('position')) && $.browser.opera) {
					self._revertToRelativePosition = true;
					el.css({ position: 'absolute', top: 'auto', left: 'auto' });
				}

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function(exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable");

		if (self._revertToRelativePosition && $.browser.opera) {
			self._revertToRelativePosition = false;
			el.css({ position: 'relative' });
		}

		$(this).removeData("resizable-alsoresize-start");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
						soffsetw = ista ? 0 : self.sizeDiff.width;

		var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
					left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

		self.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(self.element.css('width'), 10),
						height: parseInt(self.element.css('height'), 10),
						top: parseInt(self.element.css('top'), 10),
						left: parseInt(self.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					self._updateCache(data);
					self._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, el = self.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		self.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			self.containerOffset = { left: 0, top: 0 };
			self.containerPosition = { left: 0, top: 0 };

			self.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			self.containerOffset = element.offset();
			self.containerPosition = element.position();
			self.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = self.containerOffset, ch = self.containerSize.height,	cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			self.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options,
				ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
				pRatio = self._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (self._helper ? co.left : 0)) {
			self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
			if (pRatio) self.size.height = self.size.width / o.aspectRatio;
			self.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (self._helper ? co.top : 0)) {
			self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
			if (pRatio) self.size.width = self.size.height * o.aspectRatio;
			self.position.top = self._helper ? co.top : 0;
		}

		self.offset.left = self.parentData.left+self.position.left;
		self.offset.top = self.parentData.top+self.position.top;

		var woset = Math.abs( (self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
					hoset = Math.abs( (self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

		var isParent = self.containerElement.get(0) == self.element.parent().get(0),
		    isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= self.parentData.left;

		if (woset + self.size.width >= self.parentData.width) {
			self.size.width = self.parentData.width - woset;
			if (pRatio) self.size.height = self.size.width / self.aspectRatio;
		}

		if (hoset + self.size.height >= self.parentData.height) {
			self.size.height = self.parentData.height - hoset;
			if (pRatio) self.size.width = self.size.height * self.aspectRatio;
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options, cp = self.position,
				co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

		var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

		if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (self._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var self = $(this).data("resizable"), o = self.options, cs = self.size;

		self.ghost = self.originalElement.clone();
		self.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		self.ghost.appendTo(self.helper);

	},

	resize: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.left = op.left - ox;
		}
		else {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
			self.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
/*
 * jQuery UI Selectable 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Selectables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.selectable", $.extend({}, $.ui.mouse, {

	_init: function() {
		var self = this;

		this.element.addClass("ui-selectable");

		this.dragged = false;

		var selectees;
		this.refresh = function() {
			selectees = $(self.options.filter, self.element[0]);
			selectees.each(function() {
				var $this = $(this);
				var pos = $this.offset();
				$.data(this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					startselected: false,
					selected: $this.hasClass('ui-selected'),
					selecting: $this.hasClass('ui-selecting'),
					unselecting: $this.hasClass('ui-unselecting')
				});
			});
		};
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		this.helper = $(document.createElement('div'))
			.css({border:'1px dotted black'})
			.addClass("ui-selectable-helper");
	},

	destroy: function() {
		this.element
			.removeClass("ui-selectable ui-selectable-disabled")
			.removeData("selectable")
			.unbind(".selectable");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var self = this;

		this.opos = [event.pageX, event.pageY];

		if (this.options.disabled)
			return;

		var options = this.options;

		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);
		this.helper.css({
			"z-index": 100,
			"position": "absolute",
			"left": event.clientX,
			"top": event.clientY,
			"width": 0,
			"height": 0
		});

		if (options.autoRefresh) {
			this.refresh();
		}

		this.selectees.filter('.ui-selected').each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.startselected = true;
			if (!event.metaKey) {
				selectee.$element.removeClass('ui-selected');
				selectee.selected = false;
				selectee.$element.addClass('ui-unselecting');
				selectee.unselecting = true;
				self._trigger("unselecting", event, {
					unselecting: selectee.element
				});
			}
		});

		$(event.target).parents().andSelf().each(function() {
			var selectee = $.data(this, "selectable-item");
			if (selectee) {
				selectee.$element.removeClass("ui-unselecting").addClass('ui-selecting');
				selectee.unselecting = false;
				selectee.selecting = true;
				selectee.selected = true;
				self._trigger("selecting", event, {
					selecting: selectee.element
				});
				return false;
			}
		});

	},

	_mouseDrag: function(event) {
		var self = this;
		this.dragged = true;

		if (this.options.disabled)
			return;

		var options = this.options;

		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item");
			if (!selectee || selectee.element == self.element[0])
				return;
			var hit = false;
			if (options.tolerance == 'touch') {
				hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
			} else if (options.tolerance == 'fit') {
				hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
			}

			if (hit) {
				if (selectee.selected) {
					selectee.$element.removeClass('ui-selected');
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					selectee.$element.removeClass('ui-unselecting');
					selectee.unselecting = false;
				}
				if (!selectee.selecting) {
					selectee.$element.addClass('ui-selecting');
					selectee.selecting = true;
					self._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
			} else {
				if (selectee.selecting) {
					if (event.metaKey && selectee.startselected) {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						selectee.$element.addClass('ui-selected');
						selectee.selected = true;
					} else {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						if (selectee.startselected) {
							selectee.$element.addClass('ui-unselecting');
							selectee.unselecting = true;
						}
						self._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (!event.metaKey && !selectee.startselected) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;

						selectee.$element.addClass('ui-unselecting');
						selectee.unselecting = true;
						self._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var self = this;

		this.dragged = false;

		var options = this.options;

		$('.ui-unselecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-unselecting');
			selectee.unselecting = false;
			selectee.startselected = false;
			self._trigger("unselected", event, {
				unselected: selectee.element
			});
		});
		$('.ui-selecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			self._trigger("selected", event, {
				selected: selectee.element
			});
		});
		this._trigger("stop", event);

		this.helper.remove();

		return false;
	}

}));

$.extend($.ui.selectable, {
	version: "1.7.1",
	defaults: {
		appendTo: 'body',
		autoRefresh: true,
		cancel: ":input,option",
		delay: 0,
		distance: 0,
		filter: '*',
		tolerance: 'touch'
	}
});

})(jQuery);
/*
 * jQuery UI Sortable 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.sortable", $.extend({}, $.ui.mouse, {
	_init: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		this.refresh();

		this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) : false;

		this.offset = this.element.offset();

		this._mouseInit();

	},

	destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled")
			.removeData("sortable")
			.unbind(".sortable");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData("sortable-item");
	},

	_mouseCapture: function(event, overrideHandle) {

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		this._refreshItems(event);

		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, 'sortable-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, 'sortable-item') == self) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options, self = this;
		this.currentContainer = this;

		this.refreshPositions();

		this.helper = this._createHelper(event);

		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		this._cacheMargins();

		this.scrollParent = this.helper.scrollParent();

		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		if(o.cursorAt)
			this._adjustOffsetFromHelper(o.cursorAt);

		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		this._createPlaceholder();

		if(o.containment)
			this._setContainment();

		if(o.cursor) { // cursor option
			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
			$('body').css("cursor", o.cursor);
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
			this.overflowOffset = this.scrollParent.offset();

		this._trigger("start", event, this._uiHash());

		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
		}

		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.positionAbs = this._convertPositionTo("absolute");

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		for (var i = this.items.length - 1; i >= 0; i--) {

			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			if(itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		this._contactContainers(event);

		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		var self = this;

		if(this.dragging) {

			this._mouseUp();

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, self._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, self._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
		if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

		$.extend(this, {
			helper: null,
			dragging: false,
			reverting: false,
			_noFinalSort: null
		});

		if(this.domPosition.prev) {
			$(this.domPosition.prev).after(this.currentItem);
		} else {
			$(this.domPosition.parent).prepend(this.currentItem);
		}

		return true;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var self = this;
		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper"), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper"), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(sortable-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data('sortable-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					if(className && !o.forcePlaceholderSize) return;

					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		self.currentItem.after(self.placeholder);

		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		for (var i = this.containers.length - 1; i >= 0; i--){

			if(this._intersectsWith(this.containers[i].containerCache)) {
				if(!this.containers[i].containerCache.over) {

					if(this.currentContainer != this.containers[i]) {

						var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[i].floating ? 'left' : 'top'];
						for (var j = this.items.length - 1; j >= 0; j--) {
							if(!$.ui.contains(this.containers[i].element[0], this.items[j].item[0])) continue;
							var cur = this.items[j][this.containers[i].floating ? 'left' : 'top'];
							if(Math.abs(cur - base) < dist) {
								dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
							}
						}

						if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
							continue;

						this.currentContainer = this.containers[i];
						itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[i].element, true);
						this._trigger("change", event, this._uiHash());
						this.containers[i]._trigger("change", event, this._uiHash(this));

						this.options.placeholder.update(this.currentContainer, this.placeholder);

					}

					this.containers[i]._trigger("over", event, this._uiHash(this));
					this.containers[i].containerCache.over = 1;
				}
			} else {
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		};
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if(obj.left != undefined) this.offset.click.left = obj.left + this.margins.left;
		if(obj.right != undefined) this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		if(obj.top != undefined) this.offset.click.top = obj.top + this.margins.top;
		if(obj.bottom != undefined) this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
	},

	_getParentOffset: function() {


		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		var delayedTriggers = [], self = this;

		if(!this._noFinalSort && this.currentItem[0].parentNode) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};

		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset cursor
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			absolutePosition: self.positionAbs, //deprecated
			offset: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

}));

$.extend($.ui.sortable, {
	getter: "serialize toArray",
	version: "1.7.1",
	eventPrefix: "sort",
	defaults: {
		appendTo: "parent",
		axis: false,
		cancel: ":input,option",
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		delay: 0,
		distance: 1,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	}
});

})(jQuery);
/*
 * jQuery UI Effects 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/
 */
;jQuery.effects || (function($) {

$.effects = {
	version: "1.7.1",

	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},

	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},

	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},

	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},

	createWrapper: function(element) {

		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent();

		var props = { width: element.outerWidth(true), height: element.outerHeight(true), 'float': element.css('float') };
		element.wrap('<div class="ui-effects-wrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');
		var wrapper = element.parent();

		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative'} );
		} else {
			var top = element.css('top'); if(isNaN(parseInt(top,10))) top = 'auto';
			var left = element.css('left'); if(isNaN(parseInt(left,10))) left = 'auto';
			wrapper.css({ position: element.css('position'), top: top, left: left, zIndex: element.css('z-index') }).show();
			element.css({position: 'relative', top: 0, left: 0 });
		}

		wrapper.css(props);
		return wrapper;
	},

	removeWrapper: function(element) {
		if (element.parent().is('.ui-effects-wrapper'))
			return element.parent().replaceWith(element);
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	},

	animateClass: function(value, duration, easing, callback) {

		var cb = (typeof easing == "function" ? easing : (callback ? callback : null));
		var ea = (typeof easing == "string" ? easing : null);

		return this.each(function() {

			var offset = {}; var that = $(this); var oldStyleAttr = that.attr("style") || '';
			if(typeof oldStyleAttr == 'object') oldStyleAttr = oldStyleAttr["cssText"]; /* Stupidly in IE, style is a object.. */
			if(value.toggle) { that.hasClass(value.toggle) ? value.remove = value.toggle : value.add = value.toggle; }

			var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			if(value.add) that.addClass(value.add); if(value.remove) that.removeClass(value.remove);
			var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this,null) : this.currentStyle));
			if(value.add) that.removeClass(value.add); if(value.remove) that.addClass(value.remove);

			for(var n in newStyle) {
				if( typeof newStyle[n] != "function" && newStyle[n] /* No functions and null properties */
				&& n.indexOf("Moz") == -1 && n.indexOf("length") == -1 /* No mozilla spezific render properties. */
				&& newStyle[n] != oldStyle[n] /* Only values that have changed are used for the animation */
				&& (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n],10)))) /* Only things that can be parsed to integers or colors */
				&& (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))) /* No need for positions when dealing with static positions */
				) offset[n] = newStyle[n];
			}

			that.animate(offset, duration, ea, function() { // Animate the newly constructed offset object
				if(typeof $(this).attr("style") == 'object') { $(this).attr("style")["cssText"] = ""; $(this).attr("style")["cssText"] = oldStyleAttr; } else $(this).attr("style", oldStyleAttr);
				if(value.add) $(this).addClass(value.add); if(value.remove) $(this).removeClass(value.remove);
				if(cb) cb.apply(this, arguments);
			});

		});
	}
};


function _normalizeArguments(a, m) {

	var o = a[1] && a[1].constructor == Object ? a[1] : {}; if(m) o.mode = m;
	var speed = a[1] && a[1].constructor != Object ? a[1] : (o.duration ? o.duration : a[2]); //either comes from options.duration or the secon/third argument
		speed = $.fx.off ? 0 : typeof speed === "number" ? speed : $.fx.speeds[speed] || $.fx.speeds._default;
	var callback = o.callback || ( $.isFunction(a[1]) && a[1] ) || ( $.isFunction(a[2]) && a[2] ) || ( $.isFunction(a[3]) && a[3] );

	return [a[0], o, speed, callback];

}

$.fn.extend({

	_show: $.fn.show,
	_hide: $.fn.hide,
	__toggle: $.fn.toggle,
	_addClass: $.fn.addClass,
	_removeClass: $.fn.removeClass,
	_toggleClass: $.fn.toggleClass,

	effect: function(fx, options, speed, callback) {
		return $.effects[fx] ? $.effects[fx].call(this, {method: fx, options: options || {}, duration: speed, callback: callback }) : null;
	},

	show: function() {
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
			return this._show.apply(this, arguments);
		else {
			return this.effect.apply(this, _normalizeArguments(arguments, 'show'));
		}
	},

	hide: function() {
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
			return this._hide.apply(this, arguments);
		else {
			return this.effect.apply(this, _normalizeArguments(arguments, 'hide'));
		}
	},

	toggle: function(){
		if(!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])) || (arguments[0].constructor == Function))
			return this.__toggle.apply(this, arguments);
		else {
			return this.effect.apply(this, _normalizeArguments(arguments, 'toggle'));
		}
	},

	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},
	toggleClass: function(classNames,speed,easing,callback) {
		return ( (typeof speed !== "boolean") && speed ) ? $.effects.animateClass.apply(this, [{ toggle: classNames },speed,easing,callback]) : this._toggleClass(classNames, speed);
	},
	morph: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	},
	switchClass: function() {
		return this.morph.apply(this, arguments);
	},

	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});

/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		$.fx.step[attr] = function(fx) {
				if ( fx.state == 0 ) {
						fx.start = getColor( fx.elem, attr );
						fx.end = getRGB( fx.end );
				}

				fx.elem.style[attr] = "rgb(" + [
						Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0],10), 255), 0),
						Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1],10), 255), 0),
						Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2],10), 255), 0)
				].join(",") + ")";
			};
});


function getRGB(color) {
		var result;

		if ( color && color.constructor == Array && color.length == 3 )
				return color;

		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
				return colors['transparent'];

		return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
		var color;

		do {
				color = $.curCSS(elem, attr);

				if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
						break;

				attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
};


var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
/*
 * jQuery UI Effects Blind 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.blind = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left'];

		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'vertical'; // Default direction

		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var ref = (direction == 'vertical') ? 'height' : 'width';
		var distance = (direction == 'vertical') ? wrapper.height() : wrapper.width();
		if(mode == 'show') wrapper.css(ref, 0); // Shift

		var animation = {};
		animation[ref] = mode == 'show' ? distance : 0;

		wrapper.animate(animation, o.duration, o.options.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Bounce 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.bounce = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left'];

		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'up'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 5; // Default # of times
		var speed = o.duration || 250; // Default speed per bounce
		if (/show|hide/.test(mode)) props.push('opacity'); // Avoid touching opacity to prevent clearType and PNG issues in IE

		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 3 : el.outerWidth({margin:true}) / 3);
		if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift
		if (mode == 'hide') distance = distance / (times * 2);
		if (mode != 'hide') times--;

		if (mode == 'show') { // Show Bounce
			var animation = {opacity: 1};
			animation[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation, speed / 2, o.options.easing);
			distance = distance / 2;
			times--;
		};
		for (var i = 0; i < times; i++) { // Bounces
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing);
			distance = (mode == 'hide') ? distance * 2 : distance / 2;
		};
		if (mode == 'hide') { // Last Bounce
			var animation = {opacity: 0};
			animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
			el.animate(animation, speed / 2, o.options.easing, function(){
				el.hide(); // Hide
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		} else {
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing, function(){
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Clip 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.clip = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left','height','width'];

		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'vertical'; // Default direction

		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var animate = el[0].tagName == 'IMG' ? wrapper : el;
		var ref = {
			size: (direction == 'vertical') ? 'height' : 'width',
			position: (direction == 'vertical') ? 'top' : 'left'
		};
		var distance = (direction == 'vertical') ? animate.height() : animate.width();
		if(mode == 'show') { animate.css(ref.size, 0); animate.css(ref.position, distance / 2); } // Shift

		var animation = {};
		animation[ref.size] = mode == 'show' ? distance : 0;
		animation[ref.position] = mode == 'show' ? 0 : distance / 2;

		animate.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Drop 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.drop = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left','opacity'];

		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var direction = o.options.direction || 'left'; // Default Direction

		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 2 : el.outerWidth({margin:true}) / 2);
		if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift

		var animation = {opacity: mode == 'show' ? 1 : 0};
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Explode 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.explode = function(o) {

	return this.queue(function() {

	var rows = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;
	var cells = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;

	o.options.mode = o.options.mode == 'toggle' ? ($(this).is(':visible') ? 'hide' : 'show') : o.options.mode;
	var el = $(this).show().css('visibility', 'hidden');
	var offset = el.offset();

	offset.top -= parseInt(el.css("marginTop"),10) || 0;
	offset.left -= parseInt(el.css("marginLeft"),10) || 0;

	var width = el.outerWidth(true);
	var height = el.outerHeight(true);

	for(var i=0;i<rows;i++) { // =
		for(var j=0;j<cells;j++) { // ||
			el
				.clone()
				.appendTo('body')
				.wrap('<div></div>')
				.css({
					position: 'absolute',
					visibility: 'visible',
					left: -j*(width/cells),
					top: -i*(height/rows)
				})
				.parent()
				.addClass('ui-effects-explode')
				.css({
					position: 'absolute',
					overflow: 'hidden',
					width: width/cells,
					height: height/rows,
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? (j-Math.floor(cells/2))*(width/cells) : 0),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? (i-Math.floor(rows/2))*(height/rows) : 0),
					opacity: o.options.mode == 'show' ? 0 : 1
				}).animate({
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? 0 : (j-Math.floor(cells/2))*(width/cells)),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? 0 : (i-Math.floor(rows/2))*(height/rows)),
					opacity: o.options.mode == 'show' ? 1 : 0
				}, o.duration || 500);
		}
	}

	setTimeout(function() {

		o.options.mode == 'show' ? el.css({ visibility: 'visible' }) : el.css({ visibility: 'visible' }).hide();
				if(o.callback) o.callback.apply(el[0]); // Callback
				el.dequeue();

				$('div.ui-effects-explode').remove();

	}, o.duration || 500);


	});

};

})(jQuery);
/*
 * jQuery UI Effects Fold 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.fold = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left'];

		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var size = o.options.size || 15; // Default fold size
		var horizFirst = !(!o.options.horizFirst); // Ensure a boolean value
		var duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2;

		$.effects.save(el, props); el.show(); // Save & Show
		var wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var widthFirst = ((mode == 'show') != horizFirst);
		var ref = widthFirst ? ['width', 'height'] : ['height', 'width'];
		var distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];
		var percent = /([0-9]+)%/.exec(size);
		if(percent) size = parseInt(percent[1],10) / 100 * distance[mode == 'hide' ? 0 : 1];
		if(mode == 'show') wrapper.css(horizFirst ? {height: 0, width: size} : {height: size, width: 0}); // Shift

		var animation1 = {}, animation2 = {};
		animation1[ref[0]] = mode == 'show' ? distance[0] : size;
		animation2[ref[1]] = mode == 'show' ? distance[1] : 0;

		wrapper.animate(animation1, duration, o.options.easing)
		.animate(animation2, duration, o.options.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Highlight 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.highlight = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['backgroundImage','backgroundColor','opacity'];

		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var color = o.options.color || "#ffff99"; // Default highlight color
		var oldColor = el.css("backgroundColor");

		$.effects.save(el, props); el.show(); // Save & Show
		el.css({backgroundImage: 'none', backgroundColor: color}); // Shift

		var animation = {backgroundColor: oldColor };
		if (mode == "hide") animation['opacity'] = 0;

		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == "hide") el.hide();
			$.effects.restore(el, props);
		if (mode == "show" && $.browser.msie) this.style.removeAttribute('filter');
			if(o.callback) o.callback.apply(this, arguments);
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Pulsate 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.pulsate = function(o) {

	return this.queue(function() {

		var el = $(this);

		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var times = o.options.times || 5; // Default # of times
		var duration = o.duration ? o.duration / 2 : $.fx.speeds._default / 2;

		if (mode == 'hide') times--;
		if (el.is(':hidden')) { // Show fadeIn
			el.css('opacity', 0);
			el.show(); // Show
			el.animate({opacity: 1}, duration, o.options.easing);
			times = times-2;
		}

		for (var i = 0; i < times; i++) { // Pulsate
			el.animate({opacity: 0}, duration, o.options.easing).animate({opacity: 1}, duration, o.options.easing);
		};
		if (mode == 'hide') { // Last Pulse
			el.animate({opacity: 0}, duration, o.options.easing, function(){
				el.hide(); // Hide
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		} else {
			el.animate({opacity: 0}, duration, o.options.easing).animate({opacity: 1}, duration, o.options.easing, function(){
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Scale 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Scale
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.puff = function(o) {

	return this.queue(function() {

		var el = $(this);

		var options = $.extend(true, {}, o.options);
		var mode = $.effects.setMode(el, o.options.mode || 'hide'); // Set Mode
		var percent = parseInt(o.options.percent,10) || 150; // Set default puff percent
		options.fade = true; // It's not a puff if it doesn't fade! :)
		var original = {height: el.height(), width: el.width()}; // Save original

		var factor = percent / 100;
		el.from = (mode == 'hide') ? original : {height: original.height * factor, width: original.width * factor};

		options.from = el.from;
		options.percent = (mode == 'hide') ? percent : 100;
		options.mode = mode;

		el.effect('scale', options, o.duration, o.callback);
		el.dequeue();
	});

};

$.effects.scale = function(o) {

	return this.queue(function() {

		var el = $(this);

		var options = $.extend(true, {}, o.options);
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var percent = parseInt(o.options.percent,10) || (parseInt(o.options.percent,10) == 0 ? 0 : (mode == 'hide' ? 0 : 100)); // Set default scaling percent
		var direction = o.options.direction || 'both'; // Set default axis
		var origin = o.options.origin; // The origin of the scaling
		if (mode != 'effect') { // Set default origin and restore for show/hide
			options.origin = origin || ['middle','center'];
			options.restore = true;
		}
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || (mode == 'show' ? {height: 0, width: 0} : original); // Default from state

		var factor = { // Set scaling factor
			y: direction != 'horizontal' ? (percent / 100) : 1,
			x: direction != 'vertical' ? (percent / 100) : 1
		};
		el.to = {height: original.height * factor.y, width: original.width * factor.x}; // Set to state

		if (o.options.fade) { // Fade option to support puff
			if (mode == 'show') {el.from.opacity = 0; el.to.opacity = 1;};
			if (mode == 'hide') {el.from.opacity = 1; el.to.opacity = 0;};
		};

		options.from = el.from; options.to = el.to; options.mode = mode;

		el.effect('size', options, o.duration, o.callback);
		el.dequeue();
	});

};

$.effects.size = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left','width','height','overflow','opacity'];
		var props1 = ['position','top','left','overflow','opacity']; // Always restore
		var props2 = ['width','height','overflow']; // Copy for children
		var cProps = ['fontSize'];
		var vProps = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
		var hProps = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];

		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var restore = o.options.restore || false; // Default restore
		var scale = o.options.scale || 'both'; // Default scale mode
		var origin = o.options.origin; // The origin of the sizing
		var original = {height: el.height(), width: el.width()}; // Save original
		el.from = o.options.from || original; // Default from state
		el.to = o.options.to || original; // Default to state
		if (origin) { // Calculate baseline shifts
			var baseline = $.effects.getBaseline(origin, original);
			el.from.top = (original.height - el.from.height) * baseline.y;
			el.from.left = (original.width - el.from.width) * baseline.x;
			el.to.top = (original.height - el.to.height) * baseline.y;
			el.to.left = (original.width - el.to.width) * baseline.x;
		};
		var factor = { // Set scaling factor
			from: {y: el.from.height / original.height, x: el.from.width / original.width},
			to: {y: el.to.height / original.height, x: el.to.width / original.width}
		};
		if (scale == 'box' || scale == 'both') { // Scale the css box
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(vProps);
				el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
			};
			if (factor.from.x != factor.to.x) { // Horizontal props scaling
				props = props.concat(hProps);
				el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
				el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
			};
		};
		if (scale == 'content' || scale == 'both') { // Scale the content
			if (factor.from.y != factor.to.y) { // Vertical props scaling
				props = props.concat(cProps);
				el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
			};
		};
		$.effects.save(el, restore ? props : props1); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		el.css('overflow','hidden').css(el.from); // Shift

		if (scale == 'content' || scale == 'both') { // Scale the children
			vProps = vProps.concat(['marginTop','marginBottom']).concat(cProps); // Add margins/font-size
			hProps = hProps.concat(['marginLeft','marginRight']); // Add margins
			props2 = props.concat(vProps).concat(hProps); // Concat
			el.find("*[width]").each(function(){
				child = $(this);
				if (restore) $.effects.save(child, props2);
				var c_original = {height: child.height(), width: child.width()}; // Save original
				child.from = {height: c_original.height * factor.from.y, width: c_original.width * factor.from.x};
				child.to = {height: c_original.height * factor.to.y, width: c_original.width * factor.to.x};
				if (factor.from.y != factor.to.y) { // Vertical props scaling
					child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
					child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
				};
				if (factor.from.x != factor.to.x) { // Horizontal props scaling
					child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
					child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
				};
				child.css(child.from); // Shift children
				child.animate(child.to, o.duration, o.options.easing, function(){
					if (restore) $.effects.restore(child, props2); // Restore children
				}); // Animate children
			});
		};

		el.animate(el.to, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, restore ? props : props1); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Shake 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.shake = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left'];

		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'left'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 3; // Default # of times
		var speed = o.duration || o.options.duration || 140; // Default speed per shake

		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';

		var animation = {}, animation1 = {}, animation2 = {};
		animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
		animation1[ref] = (motion == 'pos' ? '+=' : '-=')  + distance * 2;
		animation2[ref] = (motion == 'pos' ? '-=' : '+=')  + distance * 2;

		el.animate(animation, speed, o.options.easing);
		for (var i = 1; i < times; i++) { // Shakes
			el.animate(animation1, speed, o.options.easing).animate(animation2, speed, o.options.easing);
		};
		el.animate(animation1, speed, o.options.easing).
		animate(animation, speed / 2, o.options.easing, function(){ // Last shake
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
		});
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Slide 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.slide = function(o) {

	return this.queue(function() {

		var el = $(this), props = ['position','top','left'];

		var mode = $.effects.setMode(el, o.options.mode || 'show'); // Set Mode
		var direction = o.options.direction || 'left'; // Default Direction

		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		var distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) : el.outerWidth({margin:true}));
		if (mode == 'show') el.css(ref, motion == 'pos' ? -distance : distance); // Shift

		var animation = {};
		animation[ref] = (mode == 'show' ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		el.animate(animation, { queue: false, duration: o.duration, easing: o.options.easing, complete: function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.callback) o.callback.apply(this, arguments); // Callback
			el.dequeue();
		}});

	});

};

})(jQuery);
/*
 * jQuery UI Effects Transfer 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.transfer = function(o) {
	return this.queue(function() {
		var elem = $(this),
			target = $(o.options.to),
			endPosition = target.offset(),
			animation = {
				top: endPosition.top,
				left: endPosition.left,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = elem.offset(),
			transfer = $('<div class="ui-effects-transfer"></div>')
				.appendTo(document.body)
				.addClass(o.options.className)
				.css({
					top: startPosition.top,
					left: startPosition.left,
					height: elem.innerHeight(),
					width: elem.innerWidth(),
					position: 'absolute'
				})
				.animate(animation, o.duration, o.options.easing, function() {
					transfer.remove();
					(o.callback && o.callback.apply(elem[0], arguments));
					elem.dequeue();
				});
	});
};

})(jQuery);
/*
 * jQuery UI Accordion 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Accordion
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.accordion", {

	_init: function() {

		var o = this.options, self = this;
		this.running = 0;

		if (o.collapsible == $.ui.accordion.defaults.collapsible &&
			o.alwaysOpen != $.ui.accordion.defaults.alwaysOpen) {
			o.collapsible = !o.alwaysOpen;
		}

		if ( o.navigation ) {
			var current = this.element.find("a").filter(o.navigationFilter);
			if ( current.length ) {
				if ( current.filter(o.header).length ) {
					this.active = current;
				} else {
					this.active = current.parent().parent().prev();
					current.addClass("ui-accordion-content-active");
				}
			}
		}

		this.element.addClass("ui-accordion ui-widget ui-helper-reset");

		if (this.element[0].nodeName == "UL") {
			this.element.children("li").addClass("ui-accordion-li-fix");
		}

		this.headers = this.element.find(o.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all")
			.bind("mouseenter.accordion", function(){ $(this).addClass('ui-state-hover'); })
			.bind("mouseleave.accordion", function(){ $(this).removeClass('ui-state-hover'); })
			.bind("focus.accordion", function(){ $(this).addClass('ui-state-focus'); })
			.bind("blur.accordion", function(){ $(this).removeClass('ui-state-focus'); });

		this.headers
			.next()
				.addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");

		this.active = this._findActive(this.active || o.active).toggleClass("ui-state-default").toggleClass("ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top");
		this.active.next().addClass('ui-accordion-content-active');

		$("<span/>").addClass("ui-icon " + o.icons.header).prependTo(this.headers);
		this.active.find(".ui-icon").toggleClass(o.icons.header).toggleClass(o.icons.headerSelected);

		if ($.browser.msie) {
			this.element.find('a').css('zoom', '1');
		}

		this.resize();

		this.element.attr('role','tablist');

		this.headers
			.attr('role','tab')
			.bind('keydown', function(event) { return self._keydown(event); })
			.next()
			.attr('role','tabpanel');

		this.headers
			.not(this.active || "")
			.attr('aria-expanded','false')
			.attr("tabIndex", "-1")
			.next()
			.hide();

		if (!this.active.length) {
			this.headers.eq(0).attr('tabIndex','0');
		} else {
			this.active
				.attr('aria-expanded','true')
				.attr('tabIndex', '0');
		}

		if (!$.browser.safari)
			this.headers.find('a').attr('tabIndex','-1');

		if (o.event) {
			this.headers.bind((o.event) + ".accordion", function(event) { return self._clickHandler.call(self, event, this); });
		}

	},

	destroy: function() {
		var o = this.options;

		this.element
			.removeClass("ui-accordion ui-widget ui-helper-reset")
			.removeAttr("role")
			.unbind('.accordion')
			.removeData('accordion');

		this.headers
			.unbind(".accordion")
			.removeClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-corner-top")
			.removeAttr("role").removeAttr("aria-expanded").removeAttr("tabindex");

		this.headers.find("a").removeAttr("tabindex");
		this.headers.children(".ui-icon").remove();
		var contents = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active");
		if (o.autoHeight || o.fillHeight) {
			contents.css("height", "");
		}
	},

	_setData: function(key, value) {
		if(key == 'alwaysOpen') { key = 'collapsible'; value = !value; }
		$.widget.prototype._setData.apply(this, arguments);
	},

	_keydown: function(event) {

		var o = this.options, keyCode = $.ui.keyCode;

		if (o.disabled || event.altKey || event.ctrlKey)
			return;

		var length = this.headers.length;
		var currentIndex = this.headers.index(event.target);
		var toFocus = false;

		switch(event.keyCode) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[(currentIndex + 1) % length];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[(currentIndex - 1 + length) % length];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				return this._clickHandler({ target: event.target }, event.target);
		}

		if (toFocus) {
			$(event.target).attr('tabIndex','-1');
			$(toFocus).attr('tabIndex','0');
			toFocus.focus();
			return false;
		}

		return true;

	},

	resize: function() {

		var o = this.options, maxHeight;

		if (o.fillSpace) {

			if($.browser.msie) { var defOverflow = this.element.parent().css('overflow'); this.element.parent().css('overflow', 'hidden'); }
			maxHeight = this.element.parent().height();
			if($.browser.msie) { this.element.parent().css('overflow', defOverflow); }

			this.headers.each(function() {
				maxHeight -= $(this).outerHeight();
			});

			var maxPadding = 0;
			this.headers.next().each(function() {
				maxPadding = Math.max(maxPadding, $(this).innerHeight() - $(this).height());
			}).height(Math.max(0, maxHeight - maxPadding))
			.css('overflow', 'auto');

		} else if ( o.autoHeight ) {
			maxHeight = 0;
			this.headers.next().each(function() {
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
			}).height(maxHeight);
		}

	},

	activate: function(index) {
		var active = this._findActive(index)[0];
		this._clickHandler({ target: active }, active);
	},

	_findActive: function(selector) {
		return selector
			? typeof selector == "number"
				? this.headers.filter(":eq(" + selector + ")")
				: this.headers.not(this.headers.not(selector))
			: selector === false
				? $([])
				: this.headers.filter(":eq(0)");
	},

	_clickHandler: function(event, target) {

		var o = this.options;
		if (o.disabled) return false;

		if (!event.target && o.collapsible) {
			this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all")
				.find(".ui-icon").removeClass(o.icons.headerSelected).addClass(o.icons.header);
			this.active.next().addClass('ui-accordion-content-active');
			var toHide = this.active.next(),
				data = {
					options: o,
					newHeader: $([]),
					oldHeader: o.active,
					newContent: $([]),
					oldContent: toHide
				},
				toShow = (this.active = $([]));
			this._toggle(toShow, toHide, data);
			return false;
		}

		var clicked = $(event.currentTarget || target);
		var clickedIsActive = clicked[0] == this.active[0];

		if (this.running || (!o.collapsible && clickedIsActive)) {
			return false;
		}

		this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all")
			.find(".ui-icon").removeClass(o.icons.headerSelected).addClass(o.icons.header);
		this.active.next().addClass('ui-accordion-content-active');
		if (!clickedIsActive) {
			clicked.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top")
				.find(".ui-icon").removeClass(o.icons.header).addClass(o.icons.headerSelected);
			clicked.next().addClass('ui-accordion-content-active');
		}

		var toShow = clicked.next(),
			toHide = this.active.next(),
			data = {
				options: o,
				newHeader: clickedIsActive && o.collapsible ? $([]) : clicked,
				oldHeader: this.active,
				newContent: clickedIsActive && o.collapsible ? $([]) : toShow.find('> *'),
				oldContent: toHide.find('> *')
			},
			down = this.headers.index( this.active[0] ) > this.headers.index( clicked[0] );

		this.active = clickedIsActive ? $([]) : clicked;
		this._toggle(toShow, toHide, data, clickedIsActive, down);

		return false;

	},

	_toggle: function(toShow, toHide, data, clickedIsActive, down) {

		var o = this.options, self = this;

		this.toShow = toShow;
		this.toHide = toHide;
		this.data = data;

		var complete = function() { if(!self) return; return self._completed.apply(self, arguments); };

		this._trigger("changestart", null, this.data);

		this.running = toHide.size() === 0 ? toShow.size() : toHide.size();

		if (o.animated) {

			var animOptions = {};

			if ( o.collapsible && clickedIsActive ) {
				animOptions = {
					toShow: $([]),
					toHide: toHide,
					complete: complete,
					down: down,
					autoHeight: o.autoHeight || o.fillSpace
				};
			} else {
				animOptions = {
					toShow: toShow,
					toHide: toHide,
					complete: complete,
					down: down,
					autoHeight: o.autoHeight || o.fillSpace
				};
			}

			if (!o.proxied) {
				o.proxied = o.animated;
			}

			if (!o.proxiedDuration) {
				o.proxiedDuration = o.duration;
			}

			o.animated = $.isFunction(o.proxied) ?
				o.proxied(animOptions) : o.proxied;

			o.duration = $.isFunction(o.proxiedDuration) ?
				o.proxiedDuration(animOptions) : o.proxiedDuration;

			var animations = $.ui.accordion.animations,
				duration = o.duration,
				easing = o.animated;

			if (!animations[easing]) {
				animations[easing] = function(options) {
					this.slide(options, {
						easing: easing,
						duration: duration || 700
					});
				};
			}

			animations[easing](animOptions);

		} else {

			if (o.collapsible && clickedIsActive) {
				toShow.toggle();
			} else {
				toHide.hide();
				toShow.show();
			}

			complete(true);

		}

		toHide.prev().attr('aria-expanded','false').attr("tabIndex", "-1").blur();
		toShow.prev().attr('aria-expanded','true').attr("tabIndex", "0").focus();

	},

	_completed: function(cancel) {

		var o = this.options;

		this.running = cancel ? 0 : --this.running;
		if (this.running) return;

		if (o.clearStyle) {
			this.toShow.add(this.toHide).css({
				height: "",
				overflow: ""
			});
		}

		this._trigger('change', null, this.data);
	}

});


$.extend($.ui.accordion, {
	version: "1.7.1",
	defaults: {
		active: null,
		alwaysOpen: true, //deprecated, use collapsible
		animated: 'slide',
		autoHeight: true,
		clearStyle: false,
		collapsible: false,
		event: "click",
		fillSpace: false,
		header: "> li > :first-child,> :not(li):even",
		icons: {
			header: "ui-icon-triangle-1-e",
			headerSelected: "ui-icon-triangle-1-s"
		},
		navigation: false,
		navigationFilter: function() {
			return this.href.toLowerCase() == location.href.toLowerCase();
		}
	},
	animations: {
		slide: function(options, additions) {
			options = $.extend({
				easing: "swing",
				duration: 300
			}, options, additions);
			if ( !options.toHide.size() ) {
				options.toShow.animate({height: "show"}, options);
				return;
			}
			if ( !options.toShow.size() ) {
				options.toHide.animate({height: "hide"}, options);
				return;
			}
			var overflow = options.toShow.css('overflow'),
				percentDone,
				showProps = {},
				hideProps = {},
				fxAttrs = [ "height", "paddingTop", "paddingBottom" ],
				originalWidth;
			var s = options.toShow;
			originalWidth = s[0].style.width;
			s.width( parseInt(s.parent().width(),10) - parseInt(s.css("paddingLeft"),10) - parseInt(s.css("paddingRight"),10) - (parseInt(s.css("borderLeftWidth"),10) || 0) - (parseInt(s.css("borderRightWidth"),10) || 0) );

			$.each(fxAttrs, function(i, prop) {
				hideProps[prop] = 'hide';

				var parts = ('' + $.css(options.toShow[0], prop)).match(/^([\d+-.]+)(.*)$/);
				showProps[prop] = {
					value: parts[1],
					unit: parts[2] || 'px'
				};
			});
			options.toShow.css({ height: 0, overflow: 'hidden' }).show();
			options.toHide.filter(":hidden").each(options.complete).end().filter(":visible").animate(hideProps,{
				step: function(now, settings) {
					if (settings.prop == 'height') {
						percentDone = (settings.now - settings.start) / (settings.end - settings.start);
					}

					options.toShow[0].style[settings.prop] =
						(percentDone * showProps[settings.prop].value) + showProps[settings.prop].unit;
				},
				duration: options.duration,
				easing: options.easing,
				complete: function() {
					if ( !options.autoHeight ) {
						options.toShow.css("height", "");
					}
					options.toShow.css("width", originalWidth);
					options.toShow.css({overflow: overflow});
					options.complete();
				}
			});
		},
		bounceslide: function(options) {
			this.slide(options, {
				easing: options.down ? "easeOutBounce" : "swing",
				duration: options.down ? 1000 : 200
			});
		},
		easeslide: function(options) {
			this.slide(options, {
				easing: "easeinout",
				duration: 700
			});
		}
	}
});

})(jQuery);
/*
 * jQuery UI Datepicker 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	ui.core.js
 */

(function($) { // hide the namespace

$.extend($.ui, { datepicker: { version: "1.7.1" } });

var PROP_NAME = 'datepicker';

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this.debug = false; // Change this to true to start debugging
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
	this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
	this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
	this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
	this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
	this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
	this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
	this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
	this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[''] = { // Default regional settings
		closeText: 'Done', // Display text for close link
		prevText: 'Prev', // Display text for previous month link
		nextText: 'Next', // Display text for next month link
		currentText: 'Today', // Display text for current month link
		monthNames: ['January','February','March','April','May','June',
			'July','August','September','October','November','December'], // Names of months for drop-down and formatting
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
		dateFormat: 'mm/dd/yy', // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false // True if right-to-left language, false if left-to-right
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: 'focus', // 'focus' for popup on focus,
		showAnim: 'show', // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
		appendText: '', // Display text following the input box, e.g. showing the format
		buttonText: '...', // Text for trigger button
		buttonImage: '', // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearRange: '-10:+10', // Range of years to display in drop-down,
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
		shortYearCutoff: '+10', // Short year values < this are in the current century,
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: 'normal', // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
		beforeShow: null, // Function that takes an input field and
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: '', // Selector for an alternate field to store selected dates into
		altFormat: '', // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false // True to show button panel, false to not show it
	};
	$.extend(this._defaults, this.regional['']);
	this.dpDiv = $('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>');
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: 'hasDatepicker',

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},

	/* Override the default settings for all instances of the date picker.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
	_attachDatepicker: function(target, settings) {
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		var nodeName = target.nodeName.toLowerCase();
		var inline = (nodeName == 'div' || nodeName == 'span');
		if (!target.id)
			target.id = 'dp' + (++this.uuid);
		var inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		if (nodeName == 'input') {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([:\[\]\.])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			$('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName))
			return;
		var appendText = this._get(inst, 'appendText');
		var isRTL = this._get(inst, 'isRTL');
		if (appendText)
			input[isRTL ? 'before' : 'after']('<span class="' + this._appendClass + '">' + appendText + '</span>');
		var showOn = this._get(inst, 'showOn');
		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
			var buttonText = this._get(inst, 'buttonText');
			var buttonImage = this._get(inst, 'buttonImage');
			inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? 'before' : 'after'](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == target)
					$.datepicker._hideDatepicker();
				else
					$.datepicker._showDatepicker(target);
				return false;
			});
		}
		input.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).
			bind("setData.datepicker", function(event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key) {
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function(event, key, value){
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key){
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst));
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
	},

	/* Pop-up the date picker in a "dialog" box.
	   @param  input     element - ignored
	   @param  dateText  string - the initial date to display (in the current format)
	   @param  onSelect  function - the function(dateText) to call when a date is selected
	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
	                     event - with x/y coordinates or
	                     leave empty for default (screen centre)
	   @return the manager object */
	_dialogDatepicker: function(input, dateText, onSelect, settings, pos) {
		var inst = this._dialogInst; // internal instance
		if (!inst) {
			var id = 'dp' + (++this.uuid);
			this._dialogInput = $('<input type="text" id="' + id +
				'" size="1" style="position: absolute; top: -100px;"/>');
			this._dialogInput.keydown(this._doKeyDown);
			$('body').append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		this._dialogInput.val(dateText);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			var browserWidth = window.innerWidth || document.documentElement.clientWidth ||	document.body.clientWidth;
			var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		this._dialogInput.css('left', this._pos[0] + 'px').css('top', this._pos[1] + 'px');
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI)
			$.blockUI(this.dpDiv);
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	   @param  target    element - the target input field or division or span */
	_destroyDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName == 'input') {
			inst.trigger.remove();
			$target.siblings('.' + this._appendClass).remove().end().
				removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress);
		} else if (nodeName == 'div' || nodeName == 'span')
			$target.removeClass(this.markerClassName).empty();
	},

	/* Enable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_enableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
		target.disabled = false;
			inst.trigger.filter("button").
			each(function() { this.disabled = false; }).end().
				filter("img").
				css({opacity: '1.0', cursor: ''});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().removeClass('ui-state-disabled');
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_disableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
		target.disabled = true;
			inst.trigger.filter("button").
			each(function() { this.disabled = true; }).end().
				filter("img").
				css({opacity: '0.5', cursor: 'default'});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().addClass('ui-state-disabled');
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	   @param  target    element - the target input field or division or span
	   @return boolean - true if disabled, false if enabled */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] == target)
				return true;
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this datepicker';
		}
	},

	/* Update the settings for a date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or
	   @param  value   any - the new value for the setting (omit if above is an object) */
	_optionDatepicker: function(target, name, value) {
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		var inst = this._getInst(target);
		if (inst) {
			if (this._curInst == inst) {
				this._hideDatepicker(null);
			}
			extendRemove(inst.settings, settings);
			var date = new Date();
			extendRemove(inst, {rangeStart: null, // start of range
				endDay: null, endMonth: null, endYear: null, // end of range
				selectedDay: date.getDate(), selectedMonth: date.getMonth(),
				selectedYear: date.getFullYear(), // starting point
				currentDay: date.getDate(), currentMonth: date.getMonth(),
				currentYear: date.getFullYear(), // current selection
				drawMonth: date.getMonth(), drawYear: date.getFullYear()}); // month being drawn
			this._updateDatepicker(inst);
		}
	},

	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	   @param  target   element - the target input field or division or span
	   @param  date     Date - the new date
	   @param  endDate  Date - the new end date for a range (optional) */
	_setDateDatepicker: function(target, date, endDate) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date, endDate);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	   @param  target  element - the target input field or division or span
	   @return Date - the current date or
	           Date[2] - the current dates for a range */
	_getDateDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst && !inst.inline)
			this._setDateFromField(inst);
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var inst = $.datepicker._getInst(event.target);
		var handled = true;
		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing)
			switch (event.keyCode) {
				case 9:  $.datepicker._hideDatepicker(null, '');
						break; // hide on tab out
				case 13: var sel = $('td.' + $.datepicker._dayOverClass +
							', td.' + $.datepicker._currentClass, inst.dpDiv);
						if (sel[0])
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						else
							$.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
						return false; // don't submit the form
						break; // select the value on enter
				case 27: $.datepicker._hideDatepicker(null, $.datepicker._get(inst, 'duration'));
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
						handled = event.ctrlKey || event.metaKey;
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
						break;
				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
						handled = event.ctrlKey || event.metaKey;
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
						break;
				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Pop-up the date picker for a given input field.
	   @param  input  element - the input field attached to the date picker or
	                  event - if triggered by focus */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
			input = $('input', input.parentNode)[0];
		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
			return;
		var inst = $.datepicker._getInst(input);
		var beforeShow = $.datepicker._get(inst, 'beforeShow');
		extendRemove(inst.settings, (beforeShow ? beforeShow.apply(input, [input, inst]) : {}));
		$.datepicker._hideDatepicker(null, '');
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);
		if ($.datepicker._inDialog) // hide cursor
			input.value = '';
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}
		var isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css('position') == 'fixed';
			return !isFixed;
		});
		if (isFixed && $.browser.opera) { // correction for Opera when fixed and scrolled
			$.datepicker._pos[0] -= document.documentElement.scrollLeft;
			$.datepicker._pos[1] -= document.documentElement.scrollTop;
		}
		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		inst.rangeStart = null;
		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
		$.datepicker._updateDatepicker(inst);
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
			left: offset.left + 'px', top: offset.top + 'px'});
		if (!inst.inline) {
			var showAnim = $.datepicker._get(inst, 'showAnim') || 'show';
			var duration = $.datepicker._get(inst, 'duration');
			var postProcess = function() {
				$.datepicker._datepickerShowing = true;
				if ($.browser.msie && parseInt($.browser.version,10) < 7) // fix IE < 7 select problems
					$('iframe.ui-datepicker-cover').css({width: inst.dpDiv.width() + 4,
						height: inst.dpDiv.height() + 4});
			};
			if ($.effects && $.effects[showAnim])
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[showAnim](duration, postProcess);
			if (duration == '')
				postProcess();
			if (inst.input[0].type != 'hidden')
				inst.input[0].focus();
			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		var dims = {width: inst.dpDiv.width() + 4,
			height: inst.dpDiv.height() + 4};
		var self = this;
		inst.dpDiv.empty().append(this._generateHTML(inst))
			.find('iframe.ui-datepicker-cover').
				css({width: dims.width, height: dims.height})
			.end()
			.find('button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a')
				.bind('mouseout', function(){
					$(this).removeClass('ui-state-hover');
					if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
					if(this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
				})
				.bind('mouseover', function(){
					if (!self._isDisabledDatepicker( inst.inline ? inst.dpDiv.parent()[0] : inst.input[0])) {
						$(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
						$(this).addClass('ui-state-hover');
						if(this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
						if(this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
					}
				})
			.end()
			.find('.' + this._dayOverClass + ' a')
				.trigger('mouseover')
			.end();
		var numMonths = this._getNumberOfMonths(inst);
		var cols = numMonths[1];
		var width = 17;
		if (cols > 1) {
			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
		} else {
			inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
		}
		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('ui-datepicker-multi');
		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('ui-datepicker-rtl');
		if (inst.input && inst.input[0].type != 'hidden' && inst == $.datepicker._curInst)
			$(inst.input[0]).focus();
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth();
		var dpHeight = inst.dpDiv.outerHeight();
		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
		var viewWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + $(document).scrollLeft();
		var viewHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + $(document).scrollTop();

		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		offset.left -= (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ? Math.abs(offset.left + dpWidth - viewWidth) : 0;
		offset.top -= (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(offset.top + dpHeight + inputHeight*2 - viewHeight) : 0;

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
        while (obj && (obj.type == 'hidden' || obj.nodeType != 1)) {
            obj = obj.nextSibling;
        }
        var position = $(obj).offset();
	    return [position.left, position.top];
	},

	/* Hide the date picker from view.
	   @param  input  element - the input field attached to the date picker
	   @param  duration  string - the duration over which to close the date picker */
	_hideDatepicker: function(input, duration) {
		var inst = this._curInst;
		if (!inst || (input && inst != $.data(input, PROP_NAME)))
			return;
		if (inst.stayOpen)
			this._selectDate('#' + inst.id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear));
		inst.stayOpen = false;
		if (this._datepickerShowing) {
			duration = (duration != null ? duration : this._get(inst, 'duration'));
			var showAnim = this._get(inst, 'showAnim');
			var postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};
			if (duration != '' && $.effects && $.effects[showAnim])
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'),
					duration, postProcess);
			else
				inst.dpDiv[(duration == '' ? 'hide' : (showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide')))](duration, postProcess);
			if (duration == '')
				this._tidyDialog(inst);
			var onClose = this._get(inst, 'onClose');
			if (onClose)
				onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);  // trigger custom callback
			this._datepickerShowing = false;
			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
				if ($.blockUI) {
					$.unblockUI();
					$('body').append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
		this._curInst = null;
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst)
			return;
		var $target = $(event.target);
		if (($target.parents('#' + $.datepicker._mainDivId).length == 0) &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.hasClass($.datepicker._triggerClass) &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))
			$.datepicker._hideDatepicker(null, '');
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		}
		else {
		var date = new Date();
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst._selectingMonthYear = false;
		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value,10);
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Restore input focus after not changing month/year. */
	_clickMonthYear: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (inst.input && inst._selectingMonthYear && !$.browser.msie)
			inst.input[0].focus();
		inst._selectingMonthYear = !inst._selectingMonthYear;
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $('a', td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		if (inst.stayOpen) {
			inst.endDay = inst.endMonth = inst.endYear = null;
		}
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
		if (inst.stayOpen) {
			inst.rangeStart = this._daylightSavingAdjust(
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
			this._updateDatepicker(inst);
		}
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst.stayOpen = false;
		inst.endDay = inst.endMonth = inst.endYear = inst.rangeStart = null;
		this._selectDate(target, '');
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input)
			inst.input.val(dateStr);
		this._updateAlternate(inst);
		var onSelect = this._get(inst, 'onSelect');
		if (onSelect)
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		else if (inst.input)
			inst.input.trigger('change'); // fire the change event
		if (inst.inline)
			this._updateDatepicker(inst);
		else if (!inst.stayOpen) {
			this._hideDatepicker(null, this._get(inst, 'duration'));
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) != 'object')
				inst.input[0].focus(); // restore focus
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altField = this._get(inst, 'altField');
		if (altField) { // update alternate field too
			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
			var date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	   @param  date  Date - the date to customise
	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ''];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	   @param  date  Date - the date to get the week for
	   @return  number - the number of the week within the year that contains this date */
	iso8601Week: function(date) {
		var checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var firstMon = new Date(checkDate.getFullYear(), 1 - 1, 4); // First week always contains 4 Jan
		var firstDay = firstMon.getDay() || 7; // Day of week: Mon = 1, ..., Sun = 7
		firstMon.setDate(firstMon.getDate() + 1 - firstDay); // Preceding Monday
		if (firstDay < 4 && checkDate < firstMon) { // Adjust first three days in year if necessary
			checkDate.setDate(checkDate.getDate() - 3); // Generate for previous year
			return $.datepicker.iso8601Week(checkDate);
		} else if (checkDate > new Date(checkDate.getFullYear(), 12 - 1, 28)) { // Check last three days in year
			firstDay = new Date(checkDate.getFullYear() + 1, 1 - 1, 4).getDay() || 7;
			if (firstDay > 4 && (checkDate.getDay() || 7) < firstDay - 3) { // Adjust if necessary
				return 1;
			}
		}
		return Math.floor(((checkDate - firstMon) / 86400000) / 7) + 1; // Weeks to given date
	},

	/* Parse a string value into a date object.
	   See formatDate below for the possible formats.

	   @param  format    string - the expected format of the date
	   @param  value     string - the date in the above format
	   @param  settings  Object - attributes include:
	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  Date - the extracted date value or null if value is blank */
	parseDate: function (format, value, settings) {
		if (format == null || value == null)
			throw 'Invalid arguments';
		value = (typeof value == 'object' ? value.toString() : value + '');
		if (value == '')
			return null;
		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var year = -1;
		var month = -1;
		var day = -1;
		var doy = -1;
		var literal = false;
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		var getNumber = function(match) {
			lookAhead(match);
			var origSize = (match == '@' ? 14 : (match == 'y' ? 4 : (match == 'o' ? 3 : 2)));
			var size = origSize;
			var num = 0;
			while (size > 0 && iValue < value.length &&
					value.charAt(iValue) >= '0' && value.charAt(iValue) <= '9') {
				num = num * 10 + parseInt(value.charAt(iValue++),10);
				size--;
			}
			if (size == origSize)
				throw 'Missing number at position ' + iValue;
			return num;
		};
		var getName = function(match, shortNames, longNames) {
			var names = (lookAhead(match) ? longNames : shortNames);
			var size = 0;
			for (var j = 0; j < names.length; j++)
				size = Math.max(size, names[j].length);
			var name = '';
			var iInit = iValue;
			while (size > 0 && iValue < value.length) {
				name += value.charAt(iValue++);
				for (var i = 0; i < names.length; i++)
					if (name == names[i])
						return i + 1;
				size--;
			}
			throw 'Unknown name at position ' + iInit;
		};
		var checkLiteral = function() {
			if (value.charAt(iValue) != format.charAt(iFormat))
				throw 'Unexpected literal at position ' + iValue;
			iValue++;
		};
		var iValue = 0;
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					checkLiteral();
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'M':
						month = getName('M', monthNamesShort, monthNames);
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'"))
							checkLiteral();
						else
							literal = true;
						break;
					default:
						checkLiteral();
				}
		}
		if (year == -1)
			year = new Date().getFullYear();
		else if (year < 100)
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				var dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim)
					break;
				month++;
				day -= dim;
			} while (true);
		}
		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
			throw 'Invalid date'; // E.g. 31/02/*
		return date;
	},

	/* Standard date formats. */
	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
	COOKIE: 'D, dd M yy',
	ISO_8601: 'yy-mm-dd',
	RFC_822: 'D, d M y',
	RFC_850: 'DD, dd-M-y',
	RFC_1036: 'D, d M y',
	RFC_1123: 'D, d M yy',
	RFC_2822: 'D, d M yy',
	RSS: 'D, d M y', // RFC 822
	TIMESTAMP: '@',
	W3C: 'yy-mm-dd', // ISO 8601

	/* Format a date object into a string value.
	   The format can be combinations of the following:
	   d  - day of month (no leading zero)
	   dd - day of month (two digit)
	   o  - day of year (no leading zeros)
	   oo - day of year (three digit)
	   D  - day name short
	   DD - day name long
	   m  - month of year (no leading zero)
	   mm - month of year (two digit)
	   M  - month name short
	   MM - month name long
	   y  - year (two digit)
	   yy - year (four digit)
	   @ - Unix timestamp (ms since 01/01/1970)
	   '...' - literal text
	   '' - single quote

	   @param  format    string - the desired format of the date
	   @param  date      Date - the date value to format
	   @param  settings  Object - attributes include:
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  string - the date in the above format */
	formatDate: function (format, date, settings) {
		if (!date)
			return '';
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		var formatNumber = function(match, value, len) {
			var num = '' + value;
			if (lookAhead(match))
				while (num.length < len)
					num = '0' + num;
			return num;
		};
		var formatName = function(match, value, shortNames, longNames) {
			return (lookAhead(match) ? longNames[value] : shortNames[value]);
		};
		var output = '';
		var literal = false;
		if (date)
			for (var iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal)
					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
						literal = false;
					else
						output += format.charAt(iFormat);
				else
					switch (format.charAt(iFormat)) {
						case 'd':
							output += formatNumber('d', date.getDate(), 2);
							break;
						case 'D':
							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
							break;
						case 'o':
							var doy = date.getDate();
							for (var m = date.getMonth() - 1; m >= 0; m--)
								doy += this._getDaysInMonth(date.getFullYear(), m);
							output += formatNumber('o', doy, 3);
							break;
						case 'm':
							output += formatNumber('m', date.getMonth() + 1, 2);
							break;
						case 'M':
							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
							break;
						case 'y':
							output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
							break;
						case '@':
							output += date.getTime();
							break;
						case "'":
							if (lookAhead("'"))
								output += "'";
							else
								literal = true;
							break;
						default:
							output += format.charAt(iFormat);
					}
			}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var chars = '';
		var literal = false;
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd': case 'm': case 'y': case '@':
						chars += '0123456789';
						break;
					case 'D': case 'M':
						return null; // Accept anything
					case "'":
						if (lookAhead("'"))
							chars += "'";
						else
							literal = true;
						break;
					default:
						chars += format.charAt(iFormat);
				}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst) {
		var dateFormat = this._get(inst, 'dateFormat');
		var dates = inst.input ? inst.input.val() : null;
		inst.endDay = inst.endMonth = inst.endYear = null;
		var date = defaultDate = this._getDefaultDate(inst);
		var settings = this._getFormatConfig(inst);
		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			this.log(event);
			date = defaultDate;
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		var date = this._determineDate(this._get(inst, 'defaultDate'), new Date());
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		date = (minDate && date < minDate ? minDate : date);
		date = (maxDate && date > maxDate ? maxDate : date);
		return date;
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(date, defaultDate) {
		var offsetNumeric = function(offset) {
			var date = new Date();
			date.setDate(date.getDate() + offset);
			return date;
		};
		var offsetString = function(offset, getDaysInMonth) {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 'd') {
					case 'd' : case 'D' :
						day += parseInt(matches[1],10); break;
					case 'w' : case 'W' :
						day += parseInt(matches[1],10) * 7; break;
					case 'm' : case 'M' :
						month += parseInt(matches[1],10);
						day = Math.min(day, getDaysInMonth(year, month));
						break;
					case 'y': case 'Y' :
						year += parseInt(matches[1],10);
						day = Math.min(day, getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day);
		};
		date = (date == null ? defaultDate :
			(typeof date == 'string' ? offsetString(date, this._getDaysInMonth) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : date)));
		date = (date && date.toString() == 'Invalid Date' ? defaultDate : date);
		if (date) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(date);
	},

	/* Handle switch to/from daylight saving.
	   Hours may be non-zero on daylight saving cut-over:
	   > 12 when midnight changeover, but then cannot generate
	   midnight datetime, so jump to 1AM, otherwise reset.
	   @param  date  (Date) the date to check
	   @return  (Date) the corrected date */
	_daylightSavingAdjust: function(date) {
		if (!date) return null;
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, endDate) {
		var clear = !(date);
		var origMonth = inst.selectedMonth;
		var origYear = inst.selectedYear;
		date = this._determineDate(date, new Date());
		inst.selectedDay = inst.currentDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = date.getFullYear();
		if (origMonth != inst.selectedMonth || origYear != inst.selectedYear)
			this._notifyChange(inst);
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? '' : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var today = new Date();
		today = this._daylightSavingAdjust(
			new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
		var isRTL = this._get(inst, 'isRTL');
		var showButtonPanel = this._get(inst, 'showButtonPanel');
		var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
		var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
		var numMonths = this._getNumberOfMonths(inst);
		var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
		var stepMonths = this._get(inst, 'stepMonths');
		var stepBigMonths = this._get(inst, 'stepBigMonths');
		var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
		var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		var drawMonth = inst.drawMonth - showCurrentAtPos;
		var drawYear = inst.drawYear;
		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - numMonths[1] + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;
		var prevText = this._get(inst, 'prevText');
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
		var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery.datepicker._adjustDate(\'#' + inst.id + '\', -' + stepMonths + ', \'M\');"' +
			' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
		var nextText = this._get(inst, 'nextText');
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));
		var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery.datepicker._adjustDate(\'#' + inst.id + '\', +' + stepMonths + ', \'M\');"' +
			' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
		var currentText = this._get(inst, 'currentText');
		var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
		var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery.datepicker._hideDatepicker();">' + this._get(inst, 'closeText') + '</button>' : '');
		var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery.datepicker._gotoToday(\'#' + inst.id + '\');"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
		var firstDay = parseInt(this._get(inst, 'firstDay'),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);
		var dayNames = this._get(inst, 'dayNames');
		var dayNamesShort = this._get(inst, 'dayNamesShort');
		var dayNamesMin = this._get(inst, 'dayNamesMin');
		var monthNames = this._get(inst, 'monthNames');
		var monthNamesShort = this._get(inst, 'monthNamesShort');
		var beforeShowDay = this._get(inst, 'beforeShowDay');
		var showOtherMonths = this._get(inst, 'showOtherMonths');
		var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
		var endDate = inst.endDay ? this._daylightSavingAdjust(
			new Date(inst.endYear, inst.endMonth, inst.endDay)) : currentDate;
		var defaultDate = this._getDefaultDate(inst);
		var html = '';
		for (var row = 0; row < numMonths[0]; row++) {
			var group = '';
			for (var col = 0; col < numMonths[1]; col++) {
				var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				var cornerClass = ' ui-corner-all';
				var calender = '';
				if (isMultiMonth) {
					calender += '<div class="ui-datepicker-group ui-datepicker-group-';
					switch (col) {
						case 0: calender += 'first'; cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
						case numMonths[1]-1: calender += 'last'; cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
						default: calender += 'middle'; cornerClass = ''; break;
					}
					calender += '">';
				}
				calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					selectedDate, row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="ui-datepicker-calendar"><thead>' +
					'<tr>';
				var thead = '';
				for (var dow = 0; dow < 7; dow++) { // days of the week
					var day = (dow + firstDay) % 7;
					thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
				}
				calender += thead + '</tr></thead><tbody>';
				var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				var numRows = (isMultiMonth ? 6 : Math.ceil((leadDays + daysInMonth) / 7)); // calculate the number of rows to generate
				var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += '<tr>';
					var tbody = '';
					for (var dow = 0; dow < 7; dow++) { // create date picker days
						var daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
						var otherMonth = (printDate.getMonth() != drawMonth);
						var unselectable = otherMonth || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' ' + this._currentClass : '') + // highlight selected day
							(printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' onclick="DP_jQuery.datepicker._selectDay(\'#' +
							inst.id + '\',' + drawMonth + ',' + drawYear + ', this);return false;"') + '>' + // actions
							(otherMonth ? (showOtherMonths ? printDate.getDate() : '&#xa0;') : // display for other months
							(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
							(printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
							(printDate.getTime() >= currentDate.getTime() && printDate.getTime() <= endDate.getTime() ? // in current range
							' ui-state-active' : '') + // highlight selected day
							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display for this month
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + '</tr>';
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
							((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
				group += calender;
			}
			html += group;
		}
		html += buttonPanel + ($.browser.msie && parseInt($.browser.version,10) < 7 && !inst.inline ?
			'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			selectedDate, secondary, monthNames, monthNamesShort) {
		minDate = (inst.rangeStart && minDate && selectedDate < minDate ? selectedDate : minDate);
		var changeMonth = this._get(inst, 'changeMonth');
		var changeYear = this._get(inst, 'changeYear');
		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
		var html = '<div class="ui-datepicker-title">';
		var monthHtml = '';
		if (secondary || !changeMonth)
			monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span> ';
		else {
			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
			monthHtml += '<select class="ui-datepicker-month" ' +
				'onchange="DP_jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'M\');" ' +
				'onclick="DP_jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
			 	'>';
			for (var month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
					monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
			}
			monthHtml += '</select>';
		}
		if (!showMonthAfterYear)
			html += monthHtml + ((secondary || changeMonth || changeYear) && (!(changeMonth && changeYear)) ? '&#xa0;' : '');
		if (secondary || !changeYear)
			html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
		else {
			var years = this._get(inst, 'yearRange').split(':');
			var year = 0;
			var endYear = 0;
			if (years.length != 2) {
				year = drawYear - 10;
				endYear = drawYear + 10;
			} else if (years[0].charAt(0) == '+' || years[0].charAt(0) == '-') {
				year = drawYear + parseInt(years[0], 10);
				endYear = drawYear + parseInt(years[1], 10);
			} else {
				year = parseInt(years[0], 10);
				endYear = parseInt(years[1], 10);
			}
			year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
			endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
			html += '<select class="ui-datepicker-year" ' +
				'onchange="DP_jQuery.datepicker._selectMonthYear(\'#' + inst.id + '\', this, \'Y\');" ' +
				'onclick="DP_jQuery.datepicker._clickMonthYear(\'#' + inst.id + '\');"' +
				'>';
			for (; year <= endYear; year++) {
				html += '<option value="' + year + '"' +
					(year == drawYear ? ' selected="selected"' : '') +
					'>' + year + '</option>';
			}
			html += '</select>';
		}
		if (showMonthAfterYear)
			html += (secondary || changeMonth || changeYear ? '&#xa0;' : '') + monthHtml;
		html += '</div>'; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period == 'Y' ? offset : 0);
		var month = inst.drawMonth + (period == 'M' ? offset : 0);
		var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
		var date = this._daylightSavingAdjust(new Date(year, month, day));
		var minDate = this._getMinMaxDate(inst, 'min', true);
		var maxDate = this._getMinMaxDate(inst, 'max');
		date = (minDate && date < minDate ? minDate : date);
		date = (maxDate && date > maxDate ? maxDate : date);
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period == 'M' || period == 'Y')
			this._notifyChange(inst);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, 'onChangeMonthYear');
		if (onChange)
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, 'numberOfMonths');
		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set - may be overridden for a range. */
	_getMinMaxDate: function(inst, minMax, checkRange) {
		var date = this._determineDate(this._get(inst, minMax + 'Date'), null);
		return (!checkRange || !inst.rangeStart ? date :
			(!date || inst.rangeStart > date ? inst.rangeStart : date));
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - new Date(year, month, 32).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst);
		var date = this._daylightSavingAdjust(new Date(
			curYear, curMonth + (offset < 0 ? offset : numMonths[1]), 1));
		if (offset < 0)
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var newMinDate = (!inst.rangeStart ? null : this._daylightSavingAdjust(
			new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)));
		newMinDate = (newMinDate && inst.rangeStart < newMinDate ? inst.rangeStart : newMinDate);
		var minDate = newMinDate || this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		return ((!minDate || date >= minDate) && (!maxDate || date <= maxDate));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
	}
});

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Determine whether an object is an array. */
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick).
			find('body').append($.datepicker.dpDiv);
		$.datepicker.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate'))
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.7.1";

window.DP_jQuery = $;

})(jQuery);
/*
 * jQuery UI Dialog 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	ui.core.js
 *	ui.draggable.js
 *	ui.resizable.js
 */
(function($) {

var setDataSwitch = {
		dragStart: "start.draggable",
		drag: "drag.draggable",
		dragStop: "stop.draggable",
		maxHeight: "maxHeight.resizable",
		minHeight: "minHeight.resizable",
		maxWidth: "maxWidth.resizable",
		minWidth: "minWidth.resizable",
		resizeStart: "start.resizable",
		resize: "drag.resizable",
		resizeStop: "stop.resizable"
	},

	uiDialogClasses =
		'ui-dialog ' +
		'ui-widget ' +
		'ui-widget-content ' +
		'ui-corner-all ';

$.widget("ui.dialog", {

	_init: function() {
		this.originalTitle = this.element.attr('title');

		var self = this,
			options = this.options,

			title = options.title || this.originalTitle || '&nbsp;',
			titleId = $.ui.dialog.getTitleId(this.element),

			uiDialog = (this.uiDialog = $('<div/>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiDialogClasses + options.dialogClass)
				.css({
					position: 'absolute',
					overflow: 'hidden',
					zIndex: options.zIndex
				})
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					(options.closeOnEscape && event.keyCode
						&& event.keyCode == $.ui.keyCode.ESCAPE && self.close(event));
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),

			uiDialogContent = this.element
				.show()
				.removeAttr('title')
				.addClass(
					'ui-dialog-content ' +
					'ui-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (this.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'ui-dialog-titlebar ' +
					'ui-widget-header ' +
					'ui-corner-all ' +
					'ui-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"/>')
				.addClass(
					'ui-dialog-titlebar-close ' +
					'ui-corner-all'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('ui-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('ui-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('ui-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('ui-state-focus');
				})
				.mousedown(function(ev) {
					ev.stopPropagation();
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = $('<span/>'))
				.addClass(
					'ui-icon ' +
					'ui-icon-closethick'
				)
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span/>')
				.addClass('ui-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar);

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		(options.draggable && $.fn.draggable && this._makeDraggable());
		(options.resizable && $.fn.resizable && this._makeResizable());

		this._createButtons(options.buttons);
		this._isOpen = false;

		(options.bgiframe && $.fn.bgiframe && uiDialog.bgiframe());
		(options.autoOpen && this.open());

	},

	destroy: function() {
		(this.overlay && this.overlay.destroy());
		this.uiDialog.hide();
		this.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content ui-widget-content')
			.hide().appendTo('body');
		this.uiDialog.remove();

		(this.originalTitle && this.element.attr('title', this.originalTitle));
	},

	close: function(event) {
		var self = this;

		if (false === self._trigger('beforeclose', event)) {
			return;
		}

		(self.overlay && self.overlay.destroy());
		self.uiDialog.unbind('keypress.ui-dialog');

		(self.options.hide
			? self.uiDialog.hide(self.options.hide, function() {
				self._trigger('close', event);
			})
			: self.uiDialog.hide() && self._trigger('close', event));

		$.ui.dialog.overlay.resize();

		self._isOpen = false;
	},

	isOpen: function() {
		return this._isOpen;
	},

	moveToTop: function(force, event) {

		if ((this.options.modal && !force)
			|| (!this.options.stack && !this.options.modal)) {
			return this._trigger('focus', event);
		}

		if (this.options.zIndex > $.ui.dialog.maxZ) {
			$.ui.dialog.maxZ = this.options.zIndex;
		}
		(this.overlay && this.overlay.$el.css('z-index', $.ui.dialog.overlay.maxZ = ++$.ui.dialog.maxZ));

		var saveScroll = { scrollTop: this.element.attr('scrollTop'), scrollLeft: this.element.attr('scrollLeft') };
		this.uiDialog.css('z-index', ++$.ui.dialog.maxZ);
		this.element.attr(saveScroll);
		this._trigger('focus', event);
	},

	open: function() {
		if (this._isOpen) { return; }

		var options = this.options,
			uiDialog = this.uiDialog;

		this.overlay = options.modal ? new $.ui.dialog.overlay(this) : null;
		(uiDialog.next().length && uiDialog.appendTo('body'));
		this._size();
		this._position(options.position);
		uiDialog.show(options.show);
		this.moveToTop(true);

		(options.modal && uiDialog.bind('keypress.ui-dialog', function(event) {
			if (event.keyCode != $.ui.keyCode.TAB) {
				return;
			}

			var tabbables = $(':tabbable', this),
				first = tabbables.filter(':first')[0],
				last  = tabbables.filter(':last')[0];

			if (event.target == last && !event.shiftKey) {
				setTimeout(function() {
					first.focus();
				}, 1);
			} else if (event.target == first && event.shiftKey) {
				setTimeout(function() {
					last.focus();
				}, 1);
			}
		}));

		$([])
			.add(uiDialog.find('.ui-dialog-content :tabbable:first'))
			.add(uiDialog.find('.ui-dialog-buttonpane :tabbable:first'))
			.add(uiDialog)
			.filter(':first')
			.focus();

		this._trigger('open');
		this._isOpen = true;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = $('<div></div>')
				.addClass(
					'ui-dialog-buttonpane ' +
					'ui-widget-content ' +
					'ui-helper-clearfix'
				);

		this.uiDialog.find('.ui-dialog-buttonpane').remove();

		(typeof buttons == 'object' && buttons !== null &&
			$.each(buttons, function() { return !(hasButtons = true); }));
		if (hasButtons) {
			$.each(buttons, function(name, fn) {
				$('<button type="button"></button>')
					.addClass(
						'ui-state-default ' +
						'ui-corner-all'
					)
					.text(name)
					.click(function() { fn.apply(self.element[0], arguments); })
					.hover(
						function() {
							$(this).addClass('ui-state-hover');
						},
						function() {
							$(this).removeClass('ui-state-hover');
						}
					)
					.focus(function() {
						$(this).addClass('ui-state-focus');
					})
					.blur(function() {
						$(this).removeClass('ui-state-focus');
					})
					.appendTo(uiDialogButtonPane);
			});
			uiDialogButtonPane.appendTo(this.uiDialog);
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = this.options,
			heightBeforeDrag;

		this.uiDialog.draggable({
			cancel: '.ui-dialog-content',
			handle: '.ui-dialog-titlebar',
			containment: 'document',
			start: function() {
				heightBeforeDrag = options.height;
				$(this).height($(this).height()).addClass("ui-dialog-dragging");
				(options.dragStart && options.dragStart.apply(self.element[0], arguments));
			},
			drag: function() {
				(options.drag && options.drag.apply(self.element[0], arguments));
			},
			stop: function() {
				$(this).removeClass("ui-dialog-dragging").height(heightBeforeDrag);
				(options.dragStop && options.dragStop.apply(self.element[0], arguments));
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = this.options,
			resizeHandles = typeof handles == 'string'
				? handles
				: 'n,e,s,w,se,sw,ne,nw';

		this.uiDialog.resizable({
			cancel: '.ui-dialog-content',
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: options.minHeight,
			start: function() {
				$(this).addClass("ui-dialog-resizing");
				(options.resizeStart && options.resizeStart.apply(self.element[0], arguments));
			},
			resize: function() {
				(options.resize && options.resize.apply(self.element[0], arguments));
			},
			handles: resizeHandles,
			stop: function() {
				$(this).removeClass("ui-dialog-resizing");
				options.height = $(this).height();
				options.width = $(this).width();
				(options.resizeStop && options.resizeStop.apply(self.element[0], arguments));
				$.ui.dialog.overlay.resize();
			}
		})
		.find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
	},

	_position: function(pos) {
		var wnd = $(window), doc = $(document),
			pTop = doc.scrollTop(), pLeft = doc.scrollLeft(),
			minTop = pTop;

		if ($.inArray(pos, ['center','top','right','bottom','left']) >= 0) {
			pos = [
				pos == 'right' || pos == 'left' ? pos : 'center',
				pos == 'top' || pos == 'bottom' ? pos : 'middle'
			];
		}
		if (pos.constructor != Array) {
			pos = ['center', 'middle'];
		}
		if (pos[0].constructor == Number) {
			pLeft += pos[0];
		} else {
			switch (pos[0]) {
				case 'left':
					pLeft += 0;
					break;
				case 'right':
					pLeft += wnd.width() - this.uiDialog.outerWidth();
					break;
				default:
				case 'center':
					pLeft += (wnd.width() - this.uiDialog.outerWidth()) / 2;
			}
		}
		if (pos[1].constructor == Number) {
			pTop += pos[1];
		} else {
			switch (pos[1]) {
				case 'top':
					pTop += 0;
					break;
				case 'bottom':
					pTop += wnd.height() - this.uiDialog.outerHeight();
					break;
				default:
				case 'middle':
					pTop += (wnd.height() - this.uiDialog.outerHeight()) / 2;
			}
		}

		pTop = Math.max(pTop, minTop);
		this.uiDialog.css({top: pTop, left: pLeft});
	},

	_setData: function(key, value){
		(setDataSwitch[key] && this.uiDialog.data(setDataSwitch[key], value));
		switch (key) {
			case "buttons":
				this._createButtons(value);
				break;
			case "closeText":
				this.uiDialogTitlebarCloseText.text(value);
				break;
			case "dialogClass":
				this.uiDialog
					.removeClass(this.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;
			case "draggable":
				(value
					? this._makeDraggable()
					: this.uiDialog.draggable('destroy'));
				break;
			case "height":
				this.uiDialog.height(value);
				break;
			case "position":
				this._position(value);
				break;
			case "resizable":
				var uiDialog = this.uiDialog,
					isResizable = this.uiDialog.is(':data(resizable)');

				(isResizable && !value && uiDialog.resizable('destroy'));

				(isResizable && typeof value == 'string' &&
					uiDialog.resizable('option', 'handles', value));

				(isResizable || this._makeResizable(value));
				break;
			case "title":
				$(".ui-dialog-title", this.uiDialogTitlebar).html(value || '&nbsp;');
				break;
			case "width":
				this.uiDialog.width(value);
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options;

		this.element.css({
			height: 0,
			minHeight: 0,
			width: 'auto'
		});

		var nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();

		this.element
			.css({
				minHeight: Math.max(options.minHeight - nonContentHeight, 0),
				height: options.height == 'auto'
					? 'auto'
					: Math.max(options.height - nonContentHeight, 0)
			});
	}
});

$.extend($.ui.dialog, {
	version: "1.7.1",
	defaults: {
		autoOpen: true,
		bgiframe: false,
		buttons: {},
		closeOnEscape: true,
		closeText: 'close',
		dialogClass: '',
		draggable: true,
		hide: null,
		height: 'auto',
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: 'center',
		resizable: true,
		show: null,
		stack: true,
		title: '',
		width: 300,
		zIndex: 1000
	},

	getter: 'isOpen',

	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		return 'ui-dialog-title-' + ($el.attr('id') || ++this.uuid);
	},

	overlay: function(dialog) {
		this.$el = $.ui.dialog.overlay.create(dialog);
	}
});

$.extend($.ui.dialog.overlay, {
	instances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			setTimeout(function() {
				$(document).bind($.ui.dialog.overlay.events, function(event) {
					var dialogZ = $(event.target).parents('.ui-dialog').css('zIndex') || 0;
					return (dialogZ > $.ui.dialog.overlay.maxZ);
				});
			}, 1);

			$(document).bind('keydown.dialog-overlay', function(event) {
				(dialog.options.closeOnEscape && event.keyCode
						&& event.keyCode == $.ui.keyCode.ESCAPE && dialog.close(event));
			});

			$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
		}

		var $el = $('<div></div>').appendTo(document.body)
			.addClass('ui-widget-overlay').css({
				width: this.width(),
				height: this.height()
			});

		(dialog.options.bgiframe && $.fn.bgiframe && $el.bgiframe());

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		this.instances.splice($.inArray(this.instances, $el), 1);

		if (this.instances.length === 0) {
			$([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
	},

	height: function() {
		if ($.browser.msie && $.browser.version < 7) {
			var scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			var offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		if ($.browser.msie && $.browser.version < 7) {
			var scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			var offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy(this.$el);
	}
});

})(jQuery);
/*
 * jQuery UI Progressbar 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   ui.core.js
 */
(function($) {

$.widget("ui.progressbar", {

	_init: function() {

		this.element
			.addClass("ui-progressbar"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.attr({
				role: "progressbar",
				"aria-valuemin": this._valueMin(),
				"aria-valuemax": this._valueMax(),
				"aria-valuenow": this._value()
			});

		this.valueDiv = $('<div class="ui-progressbar-value ui-widget-header ui-corner-left"></div>').appendTo(this.element);

		this._refreshValue();

	},

	destroy: function() {

		this.element
			.removeClass("ui-progressbar"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeAttr("role")
			.removeAttr("aria-valuemin")
			.removeAttr("aria-valuemax")
			.removeAttr("aria-valuenow")
			.removeData("progressbar")
			.unbind(".progressbar");

		this.valueDiv.remove();

		$.widget.prototype.destroy.apply(this, arguments);

	},

	value: function(newValue) {
		arguments.length && this._setData("value", newValue);
		return this._value();
	},

	_setData: function(key, value) {

		switch (key) {
			case 'value':
				this.options.value = value;
				this._refreshValue();
				this._trigger('change', null, {});
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);

	},

	_value: function() {

		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;

	},

	_valueMin: function() {
		var valueMin = 0;
		return valueMin;
	},

	_valueMax: function() {
		var valueMax = 100;
		return valueMax;
	},

	_refreshValue: function() {
		var value = this.value();
		this.valueDiv[value == this._valueMax() ? 'addClass' : 'removeClass']("ui-corner-right");
		this.valueDiv.width(value + '%');
		this.element.attr("aria-valuenow", value);
	}

});

$.extend($.ui.progressbar, {
	version: "1.7.1",
	defaults: {
		value: 0
	}
});

})(jQuery);
/*
 * jQuery UI Slider 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	ui.core.js
 */

(function($) {

$.widget("ui.slider", $.extend({}, $.ui.mouse, {

	_init: function() {

		var self = this, o = this.options;
		this._keySliding = false;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();

		this.element
			.addClass("ui-slider"
				+ " ui-slider-" + this.orientation
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all");

		this.range = $([]);

		if (o.range) {

			if (o.range === true) {
				this.range = $('<div></div>');
				if (!o.values) o.values = [this._valueMin(), this._valueMin()];
				if (o.values.length && o.values.length != 2) {
					o.values = [o.values[0], o.values[0]];
				}
			} else {
				this.range = $('<div></div>');
			}

			this.range
				.appendTo(this.element)
				.addClass("ui-slider-range");

			if (o.range == "min" || o.range == "max") {
				this.range.addClass("ui-slider-range-" + o.range);
			}

			this.range.addClass("ui-widget-header");

		}

		if ($(".ui-slider-handle", this.element).length == 0)
			$('<a href="#"></a>')
				.appendTo(this.element)
				.addClass("ui-slider-handle");

		if (o.values && o.values.length) {
			while ($(".ui-slider-handle", this.element).length < o.values.length)
				$('<a href="#"></a>')
					.appendTo(this.element)
					.addClass("ui-slider-handle");
		}

		this.handles = $(".ui-slider-handle", this.element)
			.addClass("ui-state-default"
				+ " ui-corner-all");

		this.handle = this.handles.eq(0);

		this.handles.add(this.range).filter("a")
			.click(function(event) { event.preventDefault(); })
			.hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); })
			.focus(function() { $(".ui-slider .ui-state-focus").removeClass('ui-state-focus'); $(this).addClass('ui-state-focus'); })
			.blur(function() { $(this).removeClass('ui-state-focus'); });

		this.handles.each(function(i) {
			$(this).data("index.ui-slider-handle", i);
		});

		this.handles.keydown(function(event) {

			var ret = true;

			var index = $(this).data("index.ui-slider-handle");

			if (self.options.disabled)
				return;

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					ret = false;
					if (!self._keySliding) {
						self._keySliding = true;
						$(this).addClass("ui-state-active");
						self._start(event, index);
					}
					break;
			}

			var curVal, newVal, step = self._step();
			if (self.options.values && self.options.values.length) {
				curVal = newVal = self.values(index);
			} else {
				curVal = newVal = self.value();
			}

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
					newVal = self._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = self._valueMax();
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					if(curVal == self._valueMax()) return;
					newVal = curVal + step;
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if(curVal == self._valueMin()) return;
					newVal = curVal - step;
					break;
			}

			self._slide(event, index, newVal);

			return ret;

		}).keyup(function(event) {

			var index = $(this).data("index.ui-slider-handle");

			if (self._keySliding) {
				self._stop(event, index);
				self._change(event, index);
				self._keySliding = false;
				$(this).removeClass("ui-state-active");
			}

		});

		this._refreshValue();

	},

	destroy: function() {

		this.handles.remove();
		this.range.remove();

		this.element
			.removeClass("ui-slider"
				+ " ui-slider-horizontal"
				+ " ui-slider-vertical"
				+ " ui-slider-disabled"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeData("slider")
			.unbind(".slider");

		this._mouseDestroy();

	},

	_mouseCapture: function(event) {

		var o = this.options;

		if (o.disabled)
			return false;

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		var distance = this._valueMax() - this._valueMin() + 1, closestHandle;
		var self = this, index;
		this.handles.each(function(i) {
			var thisDistance = Math.abs(normValue - self.values(i));
			if (distance > thisDistance) {
				distance = thisDistance;
				closestHandle = $(this);
				index = i;
			}
		});

		if(o.range == true && this.values(1) == o.min) {
			closestHandle = $(this.handles[++index]);
		}

		this._start(event, index);

		self._handleIndex = index;

		closestHandle
			.addClass("ui-state-active")
			.focus();

		var offset = closestHandle.offset();
		var mouseOverHandle = !$(event.target).parents().andSelf().is('.ui-slider-handle');
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - (closestHandle.width() / 2),
			top: event.pageY - offset.top
				- (closestHandle.height() / 2)
				- (parseInt(closestHandle.css('borderTopWidth'),10) || 0)
				- (parseInt(closestHandle.css('borderBottomWidth'),10) || 0)
				+ (parseInt(closestHandle.css('marginTop'),10) || 0)
		};

		normValue = this._normValueFromMouse(position);
		this._slide(event, index, normValue);
		return true;

	},

	_mouseStart: function(event) {
		return true;
	},

	_mouseDrag: function(event) {

		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		this._slide(event, this._handleIndex, normValue);

		return false;

	},

	_mouseStop: function(event) {

		this.handles.removeClass("ui-state-active");
		this._stop(event, this._handleIndex);
		this._change(event, this._handleIndex);
		this._handleIndex = null;
		this._clickOffset = null;

		return false;

	},

	_detectOrientation: function() {
		this.orientation = this.options.orientation == 'vertical' ? 'vertical' : 'horizontal';
	},

	_normValueFromMouse: function(position) {

		var pixelTotal, pixelMouse;
		if ('horizontal' == this.orientation) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
		}

		var percentMouse = (pixelMouse / pixelTotal);
		if (percentMouse > 1) percentMouse = 1;
		if (percentMouse < 0) percentMouse = 0;
		if ('vertical' == this.orientation)
			percentMouse = 1 - percentMouse;

		var valueTotal = this._valueMax() - this._valueMin(),
			valueMouse = percentMouse * valueTotal,
			valueMouseModStep = valueMouse % this.options.step,
			normValue = this._valueMin() + valueMouse - valueMouseModStep;

		if (valueMouseModStep > (this.options.step / 2))
			normValue += this.options.step;

		return parseFloat(normValue.toFixed(5));

	},

	_start: function(event, index) {
		var uiHash = {
			handle: this.handles[index],
			value: this.value()
		};
		if (this.options.values && this.options.values.length) {
			uiHash.value = this.values(index)
			uiHash.values = this.values()
		}
		this._trigger("start", event, uiHash);
	},

	_slide: function(event, index, newVal) {

		var handle = this.handles[index];

		if (this.options.values && this.options.values.length) {

			var otherVal = this.values(index ? 0 : 1);

			if ((index == 0 && newVal >= otherVal) || (index == 1 && newVal <= otherVal))
				newVal = otherVal;

			if (newVal != this.values(index)) {
				var newValues = this.values();
				newValues[index] = newVal;
				var allowed = this._trigger("slide", event, {
					handle: this.handles[index],
					value: newVal,
					values: newValues
				});
				var otherVal = this.values(index ? 0 : 1);
				if (allowed !== false) {
					this.values(index, newVal, ( event.type == 'mousedown' && this.options.animate ), true);
				}
			}

		} else {

			if (newVal != this.value()) {
				var allowed = this._trigger("slide", event, {
					handle: this.handles[index],
					value: newVal
				});
				if (allowed !== false) {
					this._setData('value', newVal, ( event.type == 'mousedown' && this.options.animate ));
				}

			}

		}

	},

	_stop: function(event, index) {
		var uiHash = {
			handle: this.handles[index],
			value: this.value()
		};
		if (this.options.values && this.options.values.length) {
			uiHash.value = this.values(index)
			uiHash.values = this.values()
		}
		this._trigger("stop", event, uiHash);
	},

	_change: function(event, index) {
		var uiHash = {
			handle: this.handles[index],
			value: this.value()
		};
		if (this.options.values && this.options.values.length) {
			uiHash.value = this.values(index)
			uiHash.values = this.values()
		}
		this._trigger("change", event, uiHash);
	},

	value: function(newValue) {

		if (arguments.length) {
			this._setData("value", newValue);
			this._change(null, 0);
		}

		return this._value();

	},

	values: function(index, newValue, animated, noPropagation) {

		if (arguments.length > 1) {
			this.options.values[index] = newValue;
			this._refreshValue(animated);
			if(!noPropagation) this._change(null, index);
		}

		if (arguments.length) {
			if (this.options.values && this.options.values.length) {
				return this._values(index);
			} else {
				return this.value();
			}
		} else {
			return this._values();
		}

	},

	_setData: function(key, value, animated) {

		$.widget.prototype._setData.apply(this, arguments);

		switch (key) {
			case 'orientation':

				this._detectOrientation();

				this.element
					.removeClass("ui-slider-horizontal ui-slider-vertical")
					.addClass("ui-slider-" + this.orientation);
				this._refreshValue(animated);
				break;
			case 'value':
				this._refreshValue(animated);
				break;
		}

	},

	_step: function() {
		var step = this.options.step;
		return step;
	},

	_value: function() {

		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;

	},

	_values: function(index) {

		if (arguments.length) {
			var val = this.options.values[index];
			if (val < this._valueMin()) val = this._valueMin();
			if (val > this._valueMax()) val = this._valueMax();

			return val;
		} else {
			return this.options.values;
		}

	},

	_valueMin: function() {
		var valueMin = this.options.min;
		return valueMin;
	},

	_valueMax: function() {
		var valueMax = this.options.max;
		return valueMax;
	},

	_refreshValue: function(animate) {

		var oRange = this.options.range, o = this.options, self = this;

		if (this.options.values && this.options.values.length) {
			var vp0, vp1;
			this.handles.each(function(i, j) {
				var valPercent = (self.values(i) - self._valueMin()) / (self._valueMax() - self._valueMin()) * 100;
				var _set = {}; _set[self.orientation == 'horizontal' ? 'left' : 'bottom'] = valPercent + '%';
				$(this).stop(1,1)[animate ? 'animate' : 'css'](_set, o.animate);
				if (self.options.range === true) {
					if (self.orientation == 'horizontal') {
						(i == 0) && self.range.stop(1,1)[animate ? 'animate' : 'css']({ left: valPercent + '%' }, o.animate);
						(i == 1) && self.range[animate ? 'animate' : 'css']({ width: (valPercent - lastValPercent) + '%' }, { queue: false, duration: o.animate });
					} else {
						(i == 0) && self.range.stop(1,1)[animate ? 'animate' : 'css']({ bottom: (valPercent) + '%' }, o.animate);
						(i == 1) && self.range[animate ? 'animate' : 'css']({ height: (valPercent - lastValPercent) + '%' }, { queue: false, duration: o.animate });
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			var value = this.value(),
				valueMin = this._valueMin(),
				valueMax = this._valueMax(),
				valPercent = valueMax != valueMin
					? (value - valueMin) / (valueMax - valueMin) * 100
					: 0;
			var _set = {}; _set[self.orientation == 'horizontal' ? 'left' : 'bottom'] = valPercent + '%';
			this.handle.stop(1,1)[animate ? 'animate' : 'css'](_set, o.animate);

			(oRange == "min") && (this.orientation == "horizontal") && this.range.stop(1,1)[animate ? 'animate' : 'css']({ width: valPercent + '%' }, o.animate);
			(oRange == "max") && (this.orientation == "horizontal") && this.range[animate ? 'animate' : 'css']({ width: (100 - valPercent) + '%' }, { queue: false, duration: o.animate });
			(oRange == "min") && (this.orientation == "vertical") && this.range.stop(1,1)[animate ? 'animate' : 'css']({ height: valPercent + '%' }, o.animate);
			(oRange == "max") && (this.orientation == "vertical") && this.range[animate ? 'animate' : 'css']({ height: (100 - valPercent) + '%' }, { queue: false, duration: o.animate });
		}

	}

}));

$.extend($.ui.slider, {
	getter: "value values",
	version: "1.7.1",
	eventPrefix: "slide",
	defaults: {
		animate: false,
		delay: 0,
		distance: 0,
		max: 100,
		min: 0,
		orientation: 'horizontal',
		range: false,
		step: 1,
		value: 0,
		values: null
	}
});

})(jQuery);
/*
 * jQuery UI Tabs 1.7.1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.tabs", {

	_init: function() {
		if (this.options.deselectable !== undefined) {
			this.options.collapsible = this.options.deselectable;
		}
		this._tabify(true);
	},

	_setData: function(key, value) {
		if (key == 'selected') {
			if (this.options.collapsible && value == this.options.selected) {
				return;
			}
			this.select(value);
		}
		else {
			this.options[key] = value;
			if (key == 'deselectable') {
				this.options.collapsible = value;
			}
			this._tabify();
		}
	},

	_tabId: function(a) {
		return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '') ||
			this.options.idPrefix + $.data(a);
	},

	_sanitizeSelector: function(hash) {
		return hash.replace(/:/g, '\\:'); // we need this because an id may contain a ":"
	},

	_cookie: function() {
		var cookie = this.cookie || (this.cookie = this.options.cookie.name || 'ui-tabs-' + $.data(this.list[0]));
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},

	_ui: function(tab, panel) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index(tab)
		};
	},

	_cleanup: function() {
		this.lis.filter('.ui-state-processing').removeClass('ui-state-processing')
				.find('span:data(label.tabs)')
				.each(function() {
					var el = $(this);
					el.html(el.data('label.tabs')).removeData('label.tabs');
				});
	},

	_tabify: function(init) {

		this.list = this.element.children('ul:first');
		this.lis = $('li:has(a[href])', this.list);
		this.anchors = this.lis.map(function() { return $('a', this)[0]; });
		this.panels = $([]);

		var self = this, o = this.options;

		var fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash
		this.anchors.each(function(i, a) {
			var href = $(a).attr('href');

			var hrefBase = href.split('#')[0], baseEl;
			if (hrefBase && (hrefBase === location.toString().split('#')[0] ||
					(baseEl = $('base')[0]) && hrefBase === baseEl.href)) {
				href = a.hash;
				a.href = href;
			}

			if (fragmentId.test(href)) {
				self.panels = self.panels.add(self._sanitizeSelector(href));
			}

			else if (href != '#') { // prevent loading the page itself if href is just "#"
				$.data(a, 'href.tabs', href); // required for restore on destroy

				$.data(a, 'load.tabs', href.replace(/#.*$/, '')); // mutable data

				var id = self._tabId(a);
				a.href = '#' + id;
				var $panel = $('#' + id);
				if (!$panel.length) {
					$panel = $(o.panelTemplate).attr('id', id).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom')
						.insertAfter(self.panels[i - 1] || self.list);
					$panel.data('destroy.tabs', true);
				}
				self.panels = self.panels.add($panel);
			}

			else {
				o.disabled.push(i);
			}
		});

		if (init) {

			this.element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
			this.list.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
			this.lis.addClass('ui-state-default ui-corner-top');
			this.panels.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');

			if (o.selected === undefined) {
				if (location.hash) {
					this.anchors.each(function(i, a) {
						if (a.hash == location.hash) {
							o.selected = i;
							return false; // break
						}
					});
				}
				if (typeof o.selected != 'number' && o.cookie) {
					o.selected = parseInt(self._cookie(), 10);
				}
				if (typeof o.selected != 'number' && this.lis.filter('.ui-tabs-selected').length) {
					o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'));
				}
				o.selected = o.selected || 0;
			}
			else if (o.selected === null) { // usage of null is deprecated, TODO remove in next release
				o.selected = -1;
			}

			o.selected = ((o.selected >= 0 && this.anchors[o.selected]) || o.selected < 0) ? o.selected : 0;

			o.disabled = $.unique(o.disabled.concat(
				$.map(this.lis.filter('.ui-state-disabled'),
					function(n, i) { return self.lis.index(n); } )
			)).sort();

			if ($.inArray(o.selected, o.disabled) != -1) {
				o.disabled.splice($.inArray(o.selected, o.disabled), 1);
			}

			this.panels.addClass('ui-tabs-hide');
			this.lis.removeClass('ui-tabs-selected ui-state-active');
			if (o.selected >= 0 && this.anchors.length) { // check for length avoids error when initializing empty list
				this.panels.eq(o.selected).removeClass('ui-tabs-hide');
				this.lis.eq(o.selected).addClass('ui-tabs-selected ui-state-active');

				self.element.queue("tabs", function() {
					self._trigger('show', null, self._ui(self.anchors[o.selected], self.panels[o.selected]));
				});

				this.load(o.selected);
			}

			$(window).bind('unload', function() {
				self.lis.add(self.anchors).unbind('.tabs');
				self.lis = self.anchors = self.panels = null;
			});

		}
		else {
			o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'));
		}

		this.element[o.collapsible ? 'addClass' : 'removeClass']('ui-tabs-collapsible');

		if (o.cookie) {
			this._cookie(o.selected, o.cookie);
		}

		for (var i = 0, li; (li = this.lis[i]); i++) {
			$(li)[$.inArray(i, o.disabled) != -1 &&
				!$(li).hasClass('ui-tabs-selected') ? 'addClass' : 'removeClass']('ui-state-disabled');
		}

		if (o.cache === false) {
			this.anchors.removeData('cache.tabs');
		}

		this.lis.add(this.anchors).unbind('.tabs');

		if (o.event != 'mouseover') {
			var addState = function(state, el) {
				if (el.is(':not(.ui-state-disabled)')) {
					el.addClass('ui-state-' + state);
				}
			};
			var removeState = function(state, el) {
				el.removeClass('ui-state-' + state);
			};
			this.lis.bind('mouseover.tabs', function() {
				addState('hover', $(this));
			});
			this.lis.bind('mouseout.tabs', function() {
				removeState('hover', $(this));
			});
			this.anchors.bind('focus.tabs', function() {
				addState('focus', $(this).closest('li'));
			});
			this.anchors.bind('blur.tabs', function() {
				removeState('focus', $(this).closest('li'));
			});
		}

		var hideFx, showFx;
		if (o.fx) {
			if ($.isArray(o.fx)) {
				hideFx = o.fx[0];
				showFx = o.fx[1];
			}
			else {
				hideFx = showFx = o.fx;
			}
		}

		function resetStyle($el, fx) {
			$el.css({ display: '' });
			if ($.browser.msie && fx.opacity) {
				$el[0].style.removeAttribute('filter');
			}
		}

		var showTab = showFx ?
			function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.hide().removeClass('ui-tabs-hide') // avoid flicker that way
					.animate(showFx, showFx.duration || 'normal', function() {
						resetStyle($show, showFx);
						self._trigger('show', null, self._ui(clicked, $show[0]));
					});
			} :
			function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.removeClass('ui-tabs-hide');
				self._trigger('show', null, self._ui(clicked, $show[0]));
			};

		var hideTab = hideFx ?
			function(clicked, $hide) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
					$hide.addClass('ui-tabs-hide');
					resetStyle($hide, hideFx);
					self.element.dequeue("tabs");
				});
			} :
			function(clicked, $hide, $show) {
				self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
				$hide.addClass('ui-tabs-hide');
				self.element.dequeue("tabs");
			};

		this.anchors.bind(o.event + '.tabs', function() {
			var el = this, $li = $(this).closest('li'), $hide = self.panels.filter(':not(.ui-tabs-hide)'),
					$show = $(self._sanitizeSelector(this.hash));

			if (($li.hasClass('ui-tabs-selected') && !o.collapsible) ||
				$li.hasClass('ui-state-disabled') ||
				$li.hasClass('ui-state-processing') ||
				self._trigger('select', null, self._ui(this, $show[0])) === false) {
				this.blur();
				return false;
			}

			o.selected = self.anchors.index(this);

			self.abort();

			if (o.collapsible) {
				if ($li.hasClass('ui-tabs-selected')) {
					o.selected = -1;

					if (o.cookie) {
						self._cookie(o.selected, o.cookie);
					}

					self.element.queue("tabs", function() {
						hideTab(el, $hide);
					}).dequeue("tabs");

					this.blur();
					return false;
				}
				else if (!$hide.length) {
					if (o.cookie) {
						self._cookie(o.selected, o.cookie);
					}

					self.element.queue("tabs", function() {
						showTab(el, $show);
					});

					self.load(self.anchors.index(this)); // TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171

					this.blur();
					return false;
				}
			}

			if (o.cookie) {
				self._cookie(o.selected, o.cookie);
			}

			if ($show.length) {
				if ($hide.length) {
					self.element.queue("tabs", function() {
						hideTab(el, $hide);
					});
				}
				self.element.queue("tabs", function() {
					showTab(el, $show);
				});

				self.load(self.anchors.index(this));
			}
			else {
				throw 'jQuery UI Tabs: Mismatching fragment identifier.';
			}

			if ($.browser.msie) {
				this.blur();
			}

		});

		this.anchors.bind('click.tabs', function(){return false;});

	},

	destroy: function() {
		var o = this.options;

		this.abort();

		this.element.unbind('.tabs')
			.removeClass('ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible')
			.removeData('tabs');

		this.list.removeClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');

		this.anchors.each(function() {
			var href = $.data(this, 'href.tabs');
			if (href) {
				this.href = href;
			}
			var $this = $(this).unbind('.tabs');
			$.each(['href', 'load', 'cache'], function(i, prefix) {
				$this.removeData(prefix + '.tabs');
			});
		});

		this.lis.unbind('.tabs').add(this.panels).each(function() {
			if ($.data(this, 'destroy.tabs')) {
				$(this).remove();
			}
			else {
				$(this).removeClass([
					'ui-state-default',
					'ui-corner-top',
					'ui-tabs-selected',
					'ui-state-active',
					'ui-state-hover',
					'ui-state-focus',
					'ui-state-disabled',
					'ui-tabs-panel',
					'ui-widget-content',
					'ui-corner-bottom',
					'ui-tabs-hide'
				].join(' '));
			}
		});

		if (o.cookie) {
			this._cookie(null, o.cookie);
		}
	},

	add: function(url, label, index) {
		if (index === undefined) {
			index = this.anchors.length; // append by default
		}

		var self = this, o = this.options,
			$li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label)),
			id = !url.indexOf('#') ? url.replace('#', '') : this._tabId($('a', $li)[0]);

		$li.addClass('ui-state-default ui-corner-top').data('destroy.tabs', true);

		var $panel = $('#' + id);
		if (!$panel.length) {
			$panel = $(o.panelTemplate).attr('id', id).data('destroy.tabs', true);
		}
		$panel.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');

		if (index >= this.lis.length) {
			$li.appendTo(this.list);
			$panel.appendTo(this.list[0].parentNode);
		}
		else {
			$li.insertBefore(this.lis[index]);
			$panel.insertBefore(this.panels[index]);
		}

		o.disabled = $.map(o.disabled,
			function(n, i) { return n >= index ? ++n : n; });

		this._tabify();

		if (this.anchors.length == 1) { // after tabify
			$li.addClass('ui-tabs-selected ui-state-active');
			$panel.removeClass('ui-tabs-hide');
			this.element.queue("tabs", function() {
				self._trigger('show', null, self._ui(self.anchors[0], self.panels[0]));
			});

			this.load(0);
		}

		this._trigger('add', null, this._ui(this.anchors[index], this.panels[index]));
	},

	remove: function(index) {
		var o = this.options, $li = this.lis.eq(index).remove(),
			$panel = this.panels.eq(index).remove();

		if ($li.hasClass('ui-tabs-selected') && this.anchors.length > 1) {
			this.select(index + (index + 1 < this.anchors.length ? 1 : -1));
		}

		o.disabled = $.map($.grep(o.disabled, function(n, i) { return n != index; }),
			function(n, i) { return n >= index ? --n : n; });

		this._tabify();

		this._trigger('remove', null, this._ui($li.find('a')[0], $panel[0]));
	},

	enable: function(index) {
		var o = this.options;
		if ($.inArray(index, o.disabled) == -1) {
			return;
		}

		this.lis.eq(index).removeClass('ui-state-disabled');
		o.disabled = $.grep(o.disabled, function(n, i) { return n != index; });

		this._trigger('enable', null, this._ui(this.anchors[index], this.panels[index]));
	},

	disable: function(index) {
		var self = this, o = this.options;
		if (index != o.selected) { // cannot disable already selected tab
			this.lis.eq(index).addClass('ui-state-disabled');

			o.disabled.push(index);
			o.disabled.sort();

			this._trigger('disable', null, this._ui(this.anchors[index], this.panels[index]));
		}
	},

	select: function(index) {
		if (typeof index == 'string') {
			index = this.anchors.index(this.anchors.filter('[href$=' + index + ']'));
		}
		else if (index === null) { // usage of null is deprecated, TODO remove in next release
			index = -1;
		}
		if (index == -1 && this.options.collapsible) {
			index = this.options.selected;
		}

		this.anchors.eq(index).trigger(this.options.event + '.tabs');
	},

	load: function(index) {
		var self = this, o = this.options, a = this.anchors.eq(index)[0], url = $.data(a, 'load.tabs');

		this.abort();

		if (!url || this.element.queue("tabs").length !== 0 && $.data(a, 'cache.tabs')) {
			this.element.dequeue("tabs");
			return;
		}

		this.lis.eq(index).addClass('ui-state-processing');

		if (o.spinner) {
			var span = $('span', a);
			span.data('label.tabs', span.html()).html(o.spinner);
		}

		this.xhr = $.ajax($.extend({}, o.ajaxOptions, {
			url: url,
			success: function(r, s) {
				$(self._sanitizeSelector(a.hash)).html(r);

				self._cleanup();

				if (o.cache) {
					$.data(a, 'cache.tabs', true); // if loaded once do not load them again
				}

				self._trigger('load', null, self._ui(self.anchors[index], self.panels[index]));
				try {
					o.ajaxOptions.success(r, s);
				}
				catch (e) {}

				self.element.dequeue("tabs");
			}
		}));
	},

	abort: function() {
		this.element.queue([]);
		this.panels.stop(false, true);

		if (this.xhr) {
			this.xhr.abort();
			delete this.xhr;
		}

		this._cleanup();

	},

	url: function(index, url) {
		this.anchors.eq(index).removeData('cache.tabs').data('load.tabs', url);
	},

	length: function() {
		return this.anchors.length;
	}

});

$.extend($.ui.tabs, {
	version: '1.7.1',
	getter: 'length',
	defaults: {
		ajaxOptions: null,
		cache: false,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		collapsible: false,
		disabled: [],
		event: 'click',
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		idPrefix: 'ui-tabs-',
		panelTemplate: '<div></div>',
		spinner: '<em>Loading&#8230;</em>',
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
	}
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend($.ui.tabs.prototype, {
	rotation: null,
	rotate: function(ms, continuing) {

		var self = this, o = this.options;

		var rotate = self._rotate || (self._rotate = function(e) {
			clearTimeout(self.rotation);
			self.rotation = setTimeout(function() {
				var t = o.selected;
				self.select( ++t < self.anchors.length ? t : 0 );
			}, ms);

			if (e) {
				e.stopPropagation();
			}
		});

		var stop = self._unrotate || (self._unrotate = !continuing ?
			function(e) {
				if (e.clientX) { // in case of a true click
					self.rotate(null);
				}
			} :
			function(e) {
				t = o.selected;
				rotate();
			});

		if (ms) {
			this.element.bind('tabsshow', rotate);
			this.anchors.bind(o.event + '.tabs', stop);
			rotate();
		}
		else {
			clearTimeout(self.rotation);
			this.element.unbind('tabsshow', rotate);
			this.anchors.unbind(o.event + '.tabs', stop);
			delete this._rotate;
			delete this._unrotate;
		}
	}
});

})(jQuery);
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
(function($){
  $.fn.scrollToCenter = function(opts){
    var html = html || ($('body')[0].scrollHeight == $('html')[0].scrollHeight ? $('body')[0] : $('html')[0]);
    var element = $(this).get(0), top = 0, left = 0;
    opts = opts || {};

    do {
      top  += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    var offsetTop  = (window.innerHeight || document.body.clientHeight) / 2;
    var offsetLeft = (window.innerWidth  || document.body.clientWidth)  / 2;

    if (opts.complete){
      var complete = opts.complete;
      opts.complete = function (){
        complete.apply(element, arguments);
      };
    }

    $(html).animate({
      scrollTop:  top  - (offsetTop  / 2),
      scrollLeft: left - (offsetLeft / 2)
    }, opts);

    return this;
  }

})(jQuery);
(function($){
  $.fn.insertAtCaret = function(text, opts) {
    var element = $(this).get(0);

    if (document.selection) {
      element.focus();
      var orig = element.value.replace(/\r\n/g, "\n");
      var range = document.selection.createRange();

      if (range.parentElement() != element) {
        return false;
      }

      range.text = text;

      var actual = tmp = element.value.replace(/\r\n/g, "\n");

      for (var diff = 0; diff < orig.length; diff++) {
        if (orig.charAt(diff) != actual.charAt(diff)) break;
      }

      for (var index = 0, start = 0; tmp.match(text) && (tmp = tmp.replace(text, "")) && index <= diff; index = start + text.length ) {
        start = actual.indexOf(text, index);
      }
    } else if (element.selectionStart) {
      var start = element.selectionStart;
      var end   = element.selectionEnd;

      element.value = element.value.substr(0, start) + text + element.value.substr(end, element.value.length);
    }

    if (start != null) {
      setCaretTo(element, start + text.length);
    } else {
      element.value += text;
    }

    return this;
  }

  $.fn.setCaretPosition = function(start, end) {
    var element = $(this).get(0);
    element.focus();
    setCaretTo(element, start, end);
    return this;
  }


  $.fn.getCaretPosition = function() {
    var element = $(this).get(0);
    $(element).focus();
    return getCaretPosition(element);
  }

  $.fn.getSelectedText = function() {
    var element = $(this).get(0);

    if (typeof element.selectionStart == 'number') {
      return $(element).val().substr(element.selectionStart, element.selectionEnd - element.selectionStart);
    } else if (document.getSelection) {
      return document.getSelection();
    } else if (window.getSelection) {
      return window.getSelection();
    }
  }

  function setCaretTo(element, start, end) {
    if(element.createTextRange) {
      var range = element.createTextRange();
      range.moveStart('character', start);
      range.moveEnd('character',   (end || start));
      range.select();
    } else if(element.selectionStart) {
      element.focus();
      element.setSelectionRange(start, (end || start));
    }
  }

  function getCaretPosition(element) {
    if (typeof element.selectionStart == 'number'){
      return element.selectionStart;
    } else if (document.selection) {
      var range = document.selection.createRange();
      var rangeLength = range.text.length;
      range.moveStart('character', -element.value.length);
      return range.text.length - rangeLength;
    }
  }
})(jQuery);

(function() {

  /*------------------------- Baseline setup ---------------------------------*/

  var root = this;

  var previousUnderscore = root._;

  var wrapper = function(obj) { this._wrapped = obj; };

  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__';

  var _ = root._ = function(obj) { return new wrapper(obj); };

  if (typeof exports !== 'undefined') exports._ = _;

  var slice                 = Array.prototype.slice,
      unshift               = Array.prototype.unshift,
      toString              = Object.prototype.toString,
      hasOwnProperty        = Object.prototype.hasOwnProperty,
      propertyIsEnumerable  = Object.prototype.propertyIsEnumerable;

  _.VERSION = '0.5.1';

  /*------------------------ Collection Functions: ---------------------------*/

  _.each = function(obj, iterator, context) {
    var index = 0;
    try {
      if (obj.forEach) {
        obj.forEach(iterator, context);
      } else if (_.isArray(obj) || _.isArguments(obj)) {
        for (var i=0, l=obj.length; i<l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        var keys = _.keys(obj), l = keys.length;
        for (var i=0; i<l; i++) iterator.call(context, obj[keys[i]], keys[i], obj);
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  };

  _.map = function(obj, iterator, context) {
    if (obj && _.isFunction(obj.map)) return obj.map(iterator, context);
    var results = [];
    _.each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  _.reduce = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduce)) return obj.reduce(_.bind(iterator, context), memo);
    _.each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  _.reduceRight = function(obj, memo, iterator, context) {
    if (obj && _.isFunction(obj.reduceRight)) return obj.reduceRight(_.bind(iterator, context), memo);
    var reversed = _.clone(_.toArray(obj)).reverse();
    _.each(reversed, function(value, index) {
      memo = iterator.call(context, memo, value, index, obj);
    });
    return memo;
  };

  _.detect = function(obj, iterator, context) {
    var result;
    _.each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        _.breakLoop();
      }
    });
    return result;
  };

  _.select = function(obj, iterator, context) {
    if (obj && _.isFunction(obj.filter)) return obj.filter(iterator, context);
    var results = [];
    _.each(obj, function(value, index, list) {
      iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  _.reject = function(obj, iterator, context) {
    var results = [];
    _.each(obj, function(value, index, list) {
      !iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  _.all = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.every)) return obj.every(iterator, context);
    var result = true;
    _.each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) _.breakLoop();
    });
    return result;
  };

  _.any = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (obj && _.isFunction(obj.some)) return obj.some(iterator, context);
    var result = false;
    _.each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) _.breakLoop();
    });
    return result;
  };

  _.include = function(obj, target) {
    if (_.isArray(obj)) return _.indexOf(obj, target) != -1;
    var found = false;
    _.each(obj, function(value) {
      if (found = value === target) _.breakLoop();
    });
    return found;
  };

  _.invoke = function(obj, method) {
    var args = _.rest(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    _.each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    _.each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.map(iterable, function(val){ return val; });
  };

  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  /*-------------------------- Array Functions: ------------------------------*/

  _.first = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  _.last = function(array) {
    return array[array.length - 1];
  };

  _.compact = function(array) {
    return _.select(array, function(value){ return !!value; });
  };

  _.flatten = function(array) {
    return _.reduce(array, [], function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo.push(value);
      return memo;
    });
  };

  _.without = function(array) {
    var values = _.rest(arguments);
    return _.select(array, function(value){ return !_.include(values, value); });
  };

  _.uniq = function(array, isSorted) {
    return _.reduce(array, [], function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo.push(el);
      return memo;
    });
  };

  _.intersect = function(array) {
    var rest = _.rest(arguments);
    return _.select(_.uniq(array), function(item) {
      return _.all(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  _.zip = function() {
    var args = _.toArray(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i=0; i<length; i++) results[i] = _.pluck(args, String(i));
    return results;
  };

  _.indexOf = function(array, item) {
    if (array.indexOf) return array.indexOf(item);
    for (var i=0, l=array.length; i<l; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item) {
    if (array.lastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  _.range = function(start, stop, step) {
    var a     = _.toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  };

  /* ----------------------- Function Functions: -----------------------------*/

  _.bind = function(func, obj) {
    var args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || root, args.concat(_.toArray(arguments)));
    };
  };

  _.bindAll = function(obj) {
    var funcs = _.rest(arguments);
    if (funcs.length == 0) funcs = _.functions(obj);
    _.each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  _.delay = function(func, wait) {
    var args = _.rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(_.toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  };

  _.compose = function() {
    var funcs = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  /* ------------------------- Object Functions: ---------------------------- */

  _.keys = function(obj) {
    if(_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };

  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  _.functions = function(obj) {
    return _.select(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  _.extend = function(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  };

  _.clone = function(obj) {
    if (_.isArray(obj)) return obj.slice(0);
    return _.extend({}, obj);
  };

  _.isEqual = function(a, b) {
    if (a === b) return true;
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    if (a == b) return true;
    if ((!a && b) || (a && !b)) return false;
    if (a.isEqual) return a.isEqual(b);
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    if (_.isNaN(a) && _.isNaN(b)) return true;
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    if (atype !== 'object') return false;
    if (a.length && (a.length !== b.length)) return false;
    var aKeys = _.keys(a), bKeys = _.keys(b);
    if (aKeys.length != bKeys.length) return false;
    for (var key in a) if (!_.isEqual(a[key], b[key])) return false;
    return true;
  };

  _.isEmpty = function(obj) {
    return _.keys(obj).length == 0;
  };

  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  _.isArguments = function(obj) {
    return obj && _.isNumber(obj.length) && !_.isArray(obj) && !propertyIsEnumerable.call(obj, 'length');
  };

  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  _.isNull = function(obj) {
    return obj === null;
  };

  _.isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };

  var types = ['Array', 'Date', 'Function', 'Number', 'RegExp', 'String'];
  for (var i=0, l=types.length; i<l; i++) {
    (function() {
      var identifier = '[object ' + types[i] + ']';
      _['is' + types[i]] = function(obj) { return toString.call(obj) == identifier; };
    })();
  }

  /* -------------------------- Utility Functions: -------------------------- */

  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  _.identity = function(value) {
    return value;
  };

  _.breakLoop = function() {
    throw breaker;
  };

  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  _.template = function(str, data) {
    var fn = new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};' +
      'with(obj){p.push(\'' +
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'")
    + "');}return p.join('');");
    return data ? fn(data) : fn;
  };

  /*------------------------------- Aliases ----------------------------------*/

  _.forEach  = _.each;
  _.foldl    = _.inject       = _.reduce;
  _.foldr    = _.reduceRight;
  _.filter   = _.select;
  _.every    = _.all;
  _.some     = _.any;
  _.head     = _.first;
  _.tail     = _.rest;
  _.methods  = _.functions;

  /*------------------------ Setup the OOP Wrapper: --------------------------*/

  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  _.each(_.functions(_), function(name) {
    var method = _[name];
    wrapper.prototype[name] = function() {
      unshift.call(arguments, this._wrapped);
      return result(method.apply(_, arguments), this._chain);
    };
  });

  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = Array.prototype[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  _.each(['concat', 'join', 'slice'], function(name) {
    var method = Array.prototype[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();
Talker = {};



(function() {


    var HANDSHAKE_TIMEOUT = 30000;
    var RETRY_INTERVAL = 250;
    var RETRY_TIMEOUT = 30000;

    Orbited = {};

    Orbited.settings = {};
    Orbited.settings.hostname = document.domain;
    Orbited.settings.port = (location.port.length > 0) ? location.port : 80;
    Orbited.settings.protocol = location.protocol.slice(0, -1);
    Orbited.settings.log = false;
    Orbited.settings.streaming = true;
    Orbited.settings.HEARTBEAT_TIMEOUT = 6000;
    Orbited.settings.POLL_INTERVAL = 2000;
    Orbited.settings.pageLoggerHeight = '200px';
    Orbited.settings.pageLoggerWidth = null;
    Orbited.settings.enableFFPrivileges = false;
    Orbited.singleton = {};


    Orbited.Errors = {};
    Orbited.Errors.ConnectionTimeout = 101;
    Orbited.Errors.InvalidHandshake = 102;
    Orbited.Errors.UserConnectionReset = 103;
    Orbited.Errors.Unauthorized = 106;
    Orbited.Errors.RemoteConnectionFailed = 108;

    Orbited.Statuses = {};
    Orbited.Statuses.ServerClosedConnection = 201;
    Orbited.Statuses.SocketControlKilled = 301;

    Orbited.util = {};

    Orbited.util.browser = null;
    if (typeof(ActiveXObject) != "undefined") {
        Orbited.util.browser = 'ie';
    } else if (navigator.userAgent.indexOf('WebKit') != -1 || navigator.userAgent.indexOf('Konqueror') != -1) {
        Orbited.util.browser = 'webkit';
    } else if (navigator.product == 'Gecko' && window.find && !navigator.savePreferences) {
        Orbited.util.browser = 'firefox';
    } else if((typeof window.addEventStream) === 'function') {
        Orbited.util.browser = 'opera';
    }


    (function(){
        Orbited.base64 = {};

        var p = "=";
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        if (window.btoa && window.btoa('1') == 'MQ==') {
            Orbited.base64.encode = function(data) { return btoa(data); };
            Orbited.base64.decode = function(data) { return atob(data); };
            return;
        }

        Orbited.base64.encode=function(/* String */ba){
            var s=[];
            var l=ba.length;
            var rm=l%3;
            var x=l-rm;
            for (var i=0; i<x;){
            var t=ba.charCodeAt(i++)<<16|ba.charCodeAt(i++)<<8|ba.charCodeAt(i++);
            s.push(tab.charAt((t>>>18)&0x3f));
            s.push(tab.charAt((t>>>12)&0x3f));
            s.push(tab.charAt((t>>>6)&0x3f));
            s.push(tab.charAt(t&0x3f));
            }
            switch(rm){
            case 2:
            t=ba.charCodeAt(i++)<<16|ba.charCodeAt(i++)<<8;
            s.push(tab.charAt((t>>>18)&0x3f));
            s.push(tab.charAt((t>>>12)&0x3f));
            s.push(tab.charAt((t>>>6)&0x3f));
            s.push(p);
            break;
            case 1:
            t=ba.charCodeAt(i++)<<16;
            s.push(tab.charAt((t>>>18)&0x3f));
            s.push(tab.charAt((t>>>12)&0x3f));
            s.push(p);
            s.push(p);
            break;
            }
            return s.join("");  //    string
        };


        Orbited.base64.decode=function(/* string */str){
            var s=str.split("");
            var out=[];
            var l=s.length;
            var tl=0;
            while(s[--l]==p){ ++tl; }   //    strip off trailing padding
            for (var i=0; i<l;){
            var t=tab.indexOf(s[i++])<<18;
            if(i<=l){ t|=tab.indexOf(s[i++])<<12; }
            if(i<=l){ t|=tab.indexOf(s[i++])<<6; }
            if(i<=l){ t|=tab.indexOf(s[i++]); }
            out.push(String.fromCharCode((t>>>16)&0xff));
            out.push(String.fromCharCode((t>>>8)&0xff));
            out.push(String.fromCharCode(t&0xff));
            }
            while(tl--){ out.pop(); }
            return out.join(""); //     string
        };
    })();




    Orbited.loggers = {};
    Orbited.Loggers = {};
    Orbited.util.loggingSystem = null;

    if (window.Log4js) {
        Orbited.util.loggingSystem = 'log4js';
    }
    else if (window.console && console.firebug && console.firebug != "1.3.0") {
        Orbited.util.loggingSystem = 'firebug';
    }

    Orbited.getLogger = function(name) {
        if (!Orbited.loggers[name]) {
            var logger = null;
            switch (Orbited.util.loggingSystem) {
            case 'firebug':
            logger = new Orbited.Loggers.FirebugLogger(name);
            break;
            case 'log4js':
            logger = new Orbited.Loggers.Log4jsLogger(name);
            break;

            default:
            logger = new Orbited.Loggers.PageLogger(name);
            break;
            }
            Orbited.loggers[name] = logger;
        }
        return Orbited.loggers[name];
    };


    Orbited.Loggers.FirebugLogger = function(name) {
        var self = this;
        self.name = name;
        self.enabled = false;
        var padArgs = function(args) {
            var newArgs = [ name + ":" ];
            for (var i = 0; i < args.length; ++i) {
            newArgs.push(args[i]);
            }
            return newArgs;
        };
        self.log = function() {
            if (!self.enabled) { return; }
            console.log.apply(this, padArgs(arguments));
        };
        self.debug = function() {
            if (!self.enabled) { return; }
            console.debug.apply(this, padArgs(arguments));
        };
        self.info = function() {
            if (!self.enabled) { return; }
            console.info.apply(this, padArgs(arguments));
        };
        self.warn = function() {
            if (!self.enabled) { return; }
            console.warn.apply(this, padArgs(arguments));
        };
        self.error = function() {
            if (!self.enabled) { return; }
            console.error.apply(this, padArgs(arguments));
        };
        self.assert = function() {
            if (!self.enabled) { return; }
            var newArgs = [arguments[0], name + ":" ];
            for (var i = 1; i < arguments.length; ++i) {
            newArgs.push(arguments[i]);
            }
            console.assert.apply(this, newArgs);
        };
        self.trace = function() {
            if (!self.enabled) { return; }
            console.trace.apply(this, padArgs(arguments));
        };
    };
    Orbited.singleton.pageLoggerPane = null;

    Orbited.Loggers.PageLogger = function(name) {
        var self = this;
        self.enabled = false;
        self.name = name;

        var checkPane = function() {
            if (!Orbited.singleton.pageLoggerPane) {
            var p = document.createElement("div");
            p.border = "1px solid black";
            if(Orbited.settings.pageLoggerHeight) {
                p.style.height = Orbited.settings.pageLoggerHeight;
            }
            if(Orbited.settings.pageLoggerWidth) {
                p.style.height = Orbited.settings.pageLoggerWidth;
            }

            p.style.overflow = "scroll";
            document.body.appendChild(p);
            Orbited.singleton.pageLoggerPane = p;
            }
        };
        var show = function(data) {
            checkPane();
            var d = document.createElement('div');
            d.innerHTML = data;
            Orbited.singleton.pageLoggerPane.appendChild(d);
            Orbited.singleton.pageLoggerPane.scrollTop = Orbited.singleton.pageLoggerPane.scrollHeight;
        };
        self.log = function() {
            if (!self.enabled) { return; }
            var newArgs = [ "log", new Date(), "debug", "<b>" + name + "</b>" ];
            for (var i = 0; i < arguments.length; ++i) {
            newArgs.push(arguments[i]);
            }
            show(newArgs.join(", "));
        };
        self.debug = function() {
            if (!self.enabled) { return; }
            var newArgs = [ new Date(), "debug", "<b>" + name + "</b>" ];
            for (var i = 0; i < arguments.length; ++i) {
            newArgs.push(arguments[i]);
            }
            show(newArgs.join(", "));
        };
        self.info = function() {
            if (!self.enabled) { return; }
            var newArgs = [ new Date(), "info", "<b>" + name + "</b>" ];
            for (var i = 0; i < arguments.length; ++i) {
            newArgs.push(arguments[i]);
            }
            show(newArgs.join(", "));
        };
        self.warn = function() {
        };
        self.error = function() {
        };
        self.assert = function() {
        };
        self.trace = function() {
        };
    };


    Orbited.Loggers.Log4jsLogger = function(name) {
        var self = this;
        self.name = name;
        var log4jsName = name;
        while (log4jsName.indexOf('.') != -1) {
            log4jsName = log4jsName.replace('.', '_');
        }
        var logger = Log4js.getLogger(log4jsName);
        self.logger = logger;
        logger.setLevel(Log4js.Level.OFF);

        var generateOutput = function(args) {
            var newArgs = [ name + ":" ];
            for (var i = 0; i < args.length; ++i) {
            newArgs.push(args[i]);
            }
            return newArgs.join(" ");
        };

        self.setLevel = function(level) {
            logger.setLevel(level);
        };
        self.addAppender = function(a) {
            logger.addAppender(a);
        };
        self.log= function() {
            logger.info(generateOutput(arguments));
        };
        self.debug = function() {
            logger.debug(generateOutput(arguments));
        };
        self.info = function() {
            logger.info(generateOutput(arguments));
        };
        self.warn = function() {
            logger.warn(generateOutput(arguments));
        };
        self.error = function() {
            logger.error(generateOutput(arguments));
        };
        self.assert = function() {
        };
        self.trace = function() {
        };

    };
    Orbited.system = Orbited.getLogger('system');



    Orbited.CometTransports = {};

    Orbited.util.chooseTransport = function() {
        if (Orbited.settings.streaming == false || Orbited.util.browser == "webkit") {
            return Orbited.CometTransports.LongPoll;
        }
        var choices = [];
        for (var name in Orbited.CometTransports) {
            var transport = Orbited.CometTransports[name];
            if (typeof(transport[Orbited.util.browser]) == "number") {
                Orbited.system.log('viable transport: ', name);
                choices.push(transport);
            }
        }
        return choices[0];
    };



    var createXHR = function () {
        try { return new XMLHttpRequest(); } catch(e) {}
        try { return new ActiveXObject('MSXML3.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('MSXML2.XMLHTTP.3.0'); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
        throw new Error('Could not find XMLHttpRequest or an alternative.');
    };


    Orbited.legacy = {};

    Orbited.CometSession = function() {
        var self = this;
        self.readyState = self.READY_STATE_INITIALIZED;
        self.onopen = function() {};
        self.onread = function() {};
        self.onclose = function() {};
        var sessionUrl = null;
        var sessionKey = null;
        var sendQueue = [];
        var packetCount = 0;
        var xhr = null;
        var handshakeTimer = null;
        var cometTransport = null;
        var pingInterval = 30000;
        var pingTimeout = 30000;
        var timeoutTimer = null;
        var lastPacketId = 0;
        var sending = false;
        var xsdClose = null;

        /*
     * This will always fire same-domain and cross-subdomain.
     * It will fire most of the time cross-port, but it's not
     * strictly guaranteed.
     * -mario
     */
        var hardClose = function() {
            var tdata = encodePackets([[++packetCount, "close"]]);
            if (xsdClose) {
                xsdClose.contentWindow.sendCloseFrame(sessionUrl.render(),tdata);
            }
            else {
                xhr.open('POST', sessionUrl.render(), !sessionUrl.isSameDomain(location.href));
                xhr.send(tdata);
            }
        }

        /*
     * self.open can only be used when readyState is INITIALIZED. Immediately
     * following a call to self.open, the readyState will be OPENING until a
     * connection with the server has been negotiated. self.open takes a url
     * as a single argument which desiginates the remote url with which to
     * establish the connection.
     */
        self.open = function(_url) {
;;;         self.logger.debug('open');
            self.readyState = self.READY_STATE_OPENING;
            sessionUrl = new Orbited.URL(_url);
            if (sessionUrl.isSameDomain(location.href)) {
                xhr = createXHR();
            }
            else {
                xhr = new Orbited.XSDR();
                if (sessionUrl.isSamePort(location.href)) {
                    xsdClose = document.createElement('iframe');
                    xsdClose.style.display = 'block';
                    xsdClose.style.width = '0';
                    xsdClose.style.height = '0';
                    xsdClose.style.border = '0';
                    xsdClose.style.margin = '0';
                    xsdClose.style.padding = '0';
                    xsdClose.style.overflow = 'hidden';
                    xsdClose.style.visibility = 'hidden';
                    var ifUrl = new Orbited.URL("");
                    ifUrl.protocol = Orbited.settings.protocol;
                    ifUrl.domain = Orbited.settings.hostname;
                    ifUrl.port = Orbited.settings.port;
                    ifUrl.path = '/static/xsdClose.html';
                    ifUrl.hash = document.domain;
                    xsdClose.src = ifUrl.render();
                    document.body.appendChild(xsdClose);
                }
            }
            if (Orbited.settings.enableFFPrivileges) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                } catch (ex) { }
            }

            xhr.open('GET', _url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        sessionKey = xhr.responseText;
;;;                     self.logger.debug('session key is: ', sessionKey);
                        resetTimeout();

                        if (sessionUrl.path[sessionUrl.path.length] != '/') {
                            sessionUrl.path += '/';
                        }
                        sessionUrl.path += sessionKey;
                        var transportClass = Orbited.util.chooseTransport();
                        cometTransport = new transportClass();
                        cometTransport.timeoutResetter = resetTimeout;
                        cometTransport.isSubDomain = sessionUrl.isSubDomain(location.href);
                        cometTransport.onReadFrame = transportOnReadFrame;
                        cometTransport.onclose = transportOnClose;
                        cometTransport.connect(sessionUrl.render());
                    } else {
                        xhr = null;
                        self.readyState = self.READY_STATE_CLOSED;
                        self.onclose(Orbited.Errors.InvalidHandshake);
                    }
                }
            };
            xhr.send(null);
        };

        /*
     * self.send is only callable when readyState is OPEN. It will queue the data
     * up for delivery as soon as the upstream xhr is ready.
     */
        self.send = function(data) {
;;;         self.logger.debug('send', data);
            if (self.readyState != self.READY_STATE_OPEN) {
                throw new Error("Invalid readyState");
            }


            data = Orbited.base64.encode(data);
            sendQueue.push([++packetCount, "data", data]);
;;;         self.logger.debug('sending ==', sending);
            if (!sending) {
;;;             self.logger.debug('starting send');
                doSend();
            }
        };

        /*
     * self.close sends a close frame to the server, at the end of the queue.
     * It also sets the readyState to CLOSING so that no further data may be
     * sent. onclose is not called immediately -- it waits for the server to
     * send a close event.
     */
        self.close = function() {
            switch(self.readyState) {
                case self.READY_STATE_CLOSING:
                case self.READY_STATE_CLOSED:
                    return;
                case self.READY_STATE_INITIALIZED:
                    self.readyState = self.READY_STATE_CLOSED;
                    return;
                default:
                    break;
            }
            self.readyState = self.READY_STATE_CLOSING;
            sendQueue.push([++packetCount, "close"]);
            if (!sending) {
                doSend();
            }
        };

        /* self.reset is a way to close immediately. The send queue will be discarded
     * and a close frame will be sent to the server. onclose is called immediately
     * without waiting for a reply from the server.
     */
        self.reset = function() {
;;;         self.logger.debug('reset');
            var origState = self.readyState;
            self.readyState = self.READY_STATE_CLOSED;
            switch(origState) {
                case self.READY_STATE_INITIALIZED:
                    self.onclose(Orbited.Errors.UserConnectionReset);
                    break;
                case self.READY_STATE_OPENING:
                    xhr.onreadystatechange = function() {};
                    xhr.abort();
                    self.onclose(Orbited.Errors.UserConnectionReset);
                    break;
                case self.READY_STATE_OPEN:
                    self.sendQueue = [];
                    self.sending = false;
                    if (xhr.readyState < 4) {
                        xhr.onreadystatechange = function() {};
                        xhr.abort();
                    }
                    doClose(Orbited.Errors.UserConnectionReset);
                    hardClose();
                    break;
                case self.READY_STATE_CLOSING:
                    break;

                case self.READY_STATE_CLOSED:
                    break;
            }
        };

        self.cleanup = function() {
            self.readyState = self.READY_STATE_CLOSED;
            cometTransport.close();
        }

        var transportOnReadFrame = function(frame) {
;;;         self.logger.debug('transportOnReadFrame');
;;;         self.logger.debug('READ FRAME: ', frame.id, frame.name, frame.data ? frame.data.length : '');
            if (!isNaN(frame.id)) {
                lastPacketId = Math.max(lastPacketId, frame.id);
            }
;;;         self.logger.debug(frame);
            switch(frame.name) {
                case 'close':
                    if (self.readyState < self.READY_STATE_CLOSED) {
                        doClose(Orbited.Statuses.ServerClosedConnection);
                    }
                    break;
                case 'data':
;;;                 self.logger.debug('base64 decoding ' + frame.data.length + ' bytes of data');
                    var data = Orbited.base64.decode(frame.data);
;;;                 self.logger.debug('decode complete');
                    self.onread(data);
                    break;
                case 'open':
                    if (self.readyState == self.READY_STATE_OPENING) {
                        self.readyState = self.READY_STATE_OPEN;
;;;                     self.logger.debug('Call self.onopen()');
                        self.onopen();
                    }
                    else {
                    }
                    break;
                case 'ping':
                    switch(cometTransport.name) {
                        case 'longpoll':
                            break;
                        case 'poll':
                            break;
                        default:
                            sendQueue.push([++packetCount, "ping", null]);
                            if (!sending) {
                                doSend();
                            }
                            break;
                    }
                    break;
                case 'opt':
                    var args = frame.data.split(',');
                    switch(args[0]) {
                        case 'pingTimeout':
                            pingTimeout = parseInt(args[1])*1000;
                            break;
                        case 'pingInterval':
                            pingInterval = parseInt(args[1])*1000;
                            break;
                        default:
;;;                         self.logger.warn('unknown opt key', args[0]);
                            break;
                    }
                    break;
            }
;;;         self.logger.debug("resetting timeout from transportOnReadFrame");
            resetTimeout();
        };
        var transportOnClose = function() {
;;;         self.logger.debug('transportOnClose');
            if (self.readyState < self.READY_STATE_CLOSED) {
                try {
                    doClose(Orbited.Statuses.ServerClosedConnection);
                }
                catch(e) {
                    return;
                }
            }
        };
        var encodePackets = function(queue) {
            var output = [];
            for (var i =0; i < queue.length; ++i) {
                var frame = queue[i];
                for (var j =0; j < frame.length; ++j) {
                    var arg = frame[j];
                    if (arg == null) {
                        arg = "";
                    }
                    if (j == frame.length-1) {
                        output.push('0');
                    }
                    else {
                        output.push('1');
                    }
                    output.push(arg.toString().length);
                    output.push(',');
                    output.push(arg.toString());
                }
            }
            return output.join("");
        };

        var doSend = function(retries) {
;;;         self.logger.debug('in doSend');
            if (typeof(retries) == "undefined") {
                retries = 0;
            }
            if (retries*RETRY_INTERVAL >= RETRY_TIMEOUT) {
                doClose(Orbited.Errors.ConnectionTimeout);
                sending = false;
                return;
            }
            if (sendQueue.length == 0) {
;;;             self.logger.debug('sendQueue exhausted');
                sending = false;
                return;
            }
            sending = true;
;;;         self.logger.debug('setting sending=true');
            var numSent = sendQueue.length;
            sessionUrl.setQsParameter('ack', lastPacketId);
            var tdata = encodePackets(sendQueue);
;;;         self.logger.debug('post', retries, tdata);
            if (Orbited.settings.enableFFPrivileges) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                } catch (ex) { }
            }
            xhr.open('POST', sessionUrl.render(), true);
            xhr.onreadystatechange = function() {
;;;             self.logger.debug('doSend onreadystatechange');
                switch(xhr.readyState) {
                    case 4:
                        if (xhr.status == 200) {
                            resetTimeout();
                            sendQueue.splice(0, numSent);
                            return doSend();
                        }
                        else {
                            window.setTimeout(function(){doSend(++retries);},RETRY_INTERVAL);
                        }
                        break;
                }
            };
            xhr.send(tdata);
        };

        var doClose = function(code) {
;;;         self.logger.debug('doClose', code);
            unsetTimeout();
            self.readyState = self.READY_STATE_CLOSED;
            if (cometTransport != null) {
                cometTransport.onReadFrame = function() {};
                cometTransport.onclose = function() { };
                cometTransport.close();
            }
            self.onclose(code);

        };

        var resetTimeout = function() {
;;;         self.logger.debug('reset Timeout', pingInterval+pingTimeout);
            unsetTimeout();
            timeoutTimer = window.setTimeout(timedOut, pingInterval + pingTimeout);
        };
        var unsetTimeout = function() {
            window.clearTimeout(timeoutTimer);

        };
        var timedOut = function() {
;;;         self.logger.debug('timed out!');
            doClose(Orbited.Errors.ConnectionTimeout);
        };
    };
    Orbited.CometSession.prototype.logger = Orbited.getLogger("Orbited.CometSession");
    Orbited.CometSession.prototype.READY_STATE_INITIALIZED    = 1;
    Orbited.CometSession.prototype.READY_STATE_OPENING    = 2;
    Orbited.CometSession.prototype.READY_STATE_OPEN        = 3;
    Orbited.CometSession.prototype.READY_STATE_CLOSING    = 4;
    Orbited.CometSession.prototype.READY_STATE_CLOSED    = 5;

    var currentTCPSocketId = 0;
    var openSockets = {};

    Orbited.test = {};
    Orbited.test.logger = Orbited.getLogger("Orbited.test");

    Orbited.test.socketcontrol = {};
    Orbited.test.socketcontrol.kill = function(t) {
;;;     Orbited.test.logger.debug("kill ordered for socket:", t);
        if (openSockets[t.id]) {
            openSockets[t.id](Orbited.Statuses.SocketControlKilled);
            t = null;
;;;         Orbited.test.logger.debug("socket killed");
        }
        else {
;;;         Orbited.test.logger.debug("socket not found");
        }
    };

    Orbited.test.stompdispatcher = {};
    Orbited.test.stompdispatcher.send = function(dest, msg) {
;;;     Orbited.test.logger.debug("stompdispatcher dispatching "+msg+" to "+dest);
        var s = document.createElement('script');
        s.src = "http://"+Orbited.settings.hostname+":"+Orbited.settings.port+"/system/test/stomp?";
        s.src += "msg="+msg;
        s.src += "&dest="+dest;
        document.body.appendChild(s);
    };

    Orbited.TCPSocket = function() {
        var self = this;
        self.id = ++currentTCPSocketId;

        if (arguments.length > 0) {
            throw new Error("TCPSocket() accepts no arguments");
        }
        self.readyState = self.READY_STATE_INITIALIZED;
        self.onopen = function() { };
        self.onread = function() { };
        self.onclose = function() { };
        var onCloseTriggered = false;
        var buffer = "";
        var session = null;
        var binary = false;
        var handshakeState = null;
        var hostname = null;
        var port = null;

        /* self.open attempts to establish a tcp connection to the specified remote
     * hostname on the specified port. When specified as true, the optional
     * argument, isBinary, will cause onread to return byte arrays, and send
     * will only accept a byte array.
     */
        self.open = function(_hostname, _port, isBinary) {
            if (self.readyState != self.READY_STATE_INITIALIZED) {
                throw new Error("Invalid readyState");
            }
            if (_hostname == false) {
                throw new Error("No hostname specified");
            }
            if (isNaN(_port)) {
                throw new Error("Invalid port specified");
            }
            binary = !!isBinary;
            self.readyState = self.READY_STATE_OPENING;
            hostname = _hostname;
            port = _port;
            session = new Orbited.CometSession();
            var sessionUrl = new Orbited.URL('/tcp');
            sessionUrl.domain = Orbited.settings.hostname;
            sessionUrl.port = Orbited.settings.port;
            sessionUrl.protocol = Orbited.settings.protocol;
            sessionUrl.setQsParameter('nocache', Math.random());
            session.open(sessionUrl.render());
            session.onopen = sessionOnOpen;
            session.onread = sessionOnRead;
            session.onclose = sessionOnClose;
            handshakeState = "initial";
        };

        self.close = function() {
            if (self.readyState == self.READY_STATE_CLOSED) {
                return;
            }
            self.readyState = self.READY_STATE_CLOSED;
            doClose(Orbited.Errors.UserConnectionReset);
        };

        /* self.reset closes the connection from this end immediately. The server
     * may be notified, but there is no guarantee. The main purpose of the reset
     * function is for a quick teardown in the case of a user navigation.
     * if reset is not called when IE navigates, for instance, there will be
     * potential issues with future TCPSocket communication.
     */
        self.reset = function() {
            if (session) {session.reset();}
        };

        self.send = function(data) {
            if (self.readyState != self.READY_STATE_OPEN) {
                throw new Error("Invalid readyState");
            }
            if (!binary) {
                data = Orbited.utf8.encode(data);
            }
;;;         self.logger.debug('SEND: ', data);
            session.send(data);
        };

        var process = function() {
            var result = Orbited.utf8.decode(buffer);
            var data = result[0];
            var i = result[1];
            buffer = buffer.slice(i);
            if (data.length > 0) {
                window.setTimeout(function() { self.onread(data); }, 0);
            }
        };

        var sessionOnRead = function(data) {
            switch(self.readyState) {
                case self.READY_STATE_OPEN:
;;;                 self.logger.debug('READ: ', data);
                    if (binary) {
                        window.setTimeout(function() { self.onread(data); }, 0);
                    }
                    else {
;;;                     self.logger.debug('start buffer size:', buffer.length);
                        buffer += data;
                        process();
;;;                     self.logger.debug('end buffer size:', buffer.length);
                    }
                    break;
                case self.READY_STATE_OPENING:
                    switch(handshakeState) {
                        case 'initial':
                            data = Orbited.utf8.decode(data)[0];
;;;                         self.logger.debug('initial');
;;;                         self.logger.debug('data', data);
;;;                         self.logger.debug('len', data.length);
;;;                         self.logger.debug('typeof(data)', typeof(data));
;;;                         self.logger.debug('data[0] ', data.slice(0,1));
;;;                         self.logger.debug('type ', typeof(data.slice(0,1)));
                            var result = (data.slice(0,1) == '1');
;;;                         self.logger.debug('result', result);
                            if (!result) {
;;;                             self.logger.debug('!result');
                                var errorCode = data.slice(1,4);
                                doClose(parseInt(errorCode));
                            }
                            if (result) {
                                self.readyState = self.READY_STATE_OPEN;
;;;                             self.logger.debug('tcpsocket.onopen..');
                                self.onopen();
;;;                             self.logger.debug('did onopen');
                            }
                            break;
                    }
                    break;
            }
        };
        var doClose = function(code) {
;;;         self.logger.debug('doClose', code);
            if (session) {
                if (code == Orbited.Statuses.ServerClosedConnection || code == Orbited.Errors.Unauthorized || code == Orbited.Errors.RemoteConnectionFailed) {
                    session.cleanup();
                }
                else {
                    sessionOnClose = function() {};
                    session.close();
                }
                session = null;
            }
;;;         self.logger.debug('onCloseTriggered', onCloseTriggered);
            if (!onCloseTriggered) {
;;;             self.logger.debug('triggerClose timer', code);
                onCloseTriggered = true;
                window.setTimeout(function() {
;;;                 self.logger.debug('onclose!', code);
                    self.onclose(code);
                }, 0);
            }
        };

        openSockets[self.id] = doClose;

        var sessionOnOpen = function(data) {
            var payload = hostname + ':' + port + '\n';
;;;         self.logger.debug('sessionOpen; sending:', payload);
            payload = Orbited.utf8.encode(payload);
;;;         self.logger.debug('encoded payload:', payload);
            X = payload;
            session.send(payload);
            handshakeState = 'initial';
        };

        var sessionOnClose = function(code) {
;;;         self.logger.debug('sessionOnClose');
            doClose(code);
        };
    };
    Orbited.TCPSocket.prototype.toString = function() {
        return "<Orbited.TCPSocket " + this.id + ">";
    };
    Orbited.TCPSocket.prototype.logger = Orbited.getLogger("Orbited.TCPSocket");
    Orbited.TCPSocket.prototype.READY_STATE_INITIALIZED  = 1;
    Orbited.TCPSocket.prototype.READY_STATE_OPENING         = 2;
    Orbited.TCPSocket.prototype.READY_STATE_OPEN         = 3;
    Orbited.TCPSocket.prototype.READY_STATE_CLOSING         = 4;
    Orbited.TCPSocket.prototype.READY_STATE_CLOSED         = 5;






    Orbited.singleton.XSDR = {
        receiveCbs: {},
        queues: {},
        iframes: {},
        id: 0,
        register: function(receive, queue) {
            var id = ++Orbited.singleton.XSDR.id;
            Orbited.singleton.XSDR.receiveCbs[id] = receive;
            Orbited.singleton.XSDR.queues[id] = queue;
;;;         Orbited.system.debug('id is', id);
            return id;
        }
    };
    Orbited.XSDR = function() {
        var self = this;
        var ifr = null;
        var url;
        var method;
        var data;
        var requestHeaders;
        var queue = [];
        var id = Orbited.singleton.XSDR.register(function(data) { receive(data); },queue);
        var bridgeUrl = new Orbited.URL("");
        bridgeUrl.domain = Orbited.settings.hostname;
        bridgeUrl.port = Orbited.settings.port;
        bridgeUrl.path = '/static/xsdrBridge.html';
        bridgeUrl.hash = id.toString();
        bridgeUrl.protocol = Orbited.settings.protocol;
;;;     self.logger.debug('bridgeUrl.hash is', bridgeUrl.hash);
;;;     self.logger.debug('bridgeUrl.path is', bridgeUrl.path);
;;;     self.logger.debug('bridgeUrl is', bridgeUrl.render());
        var reset = function() {
            self.responseText = "";
            self.status = null;
            self.readyState = 0;
            url = null;
            method = null;
            data = null;
            requestHeaders = {};
        };
        reset();
        self.onreadystatechange = function() { };
        self.open = function(_method, _url, async) {
            if (self.readyState == 4) {
                reset();
            }
            if (self.readyState != 0) {
                throw new Error("Invalid readyState");
            }
            if (!async) {
                throw new Error("Only Async XSDR supported");
            }
;;;         self.logger.debug('open', _method, _url, async);
            self.readyState = 1;
            url = _url;
            method = _method;
        };

        self.send = function(data) {
            if (self.readyState != 1) {
                throw new Error("Invalid readyState");
            }
;;;         self.logger.debug('send', data);
            if (!ifr) {
;;;             self.logger.debug('creating iframe');
                ifr = document.createElement("iframe");
                hideIframe(ifr);
                ifr.src = bridgeUrl.render();
;;;             self.logger.debug('set ifr.src to', ifr.src);
                document.body.appendChild(ifr);
                Orbited.singleton.XSDR.iframes[id] = ifr;
            }
            else {
                queue.push([method, url, data, requestHeaders]);
            }
        };

        self.abort = function() {
            if (self.readyState > 0 && self.readyState < 4) {
;;;             self.logger.debug('ABORT called');
                ifr.src = "about:blank";
                document.body.removeChild(ifr);
                ifr = null;
                self.readyState = 4;
                self.onreadystatechange();
            }
        };



        self.setRequestHeader = function(key, val) {
            if (self.readyState != 0) {
                throw new Error("Invalid readyState");
            }
            requestHeaders[key] = val;
        };

        self.getResponseHeader = function() {
            if (self.readyState < 2) {
                throw new Error("Invalid readyState");
            }
            return responseHeaders[key];
        };

        var receive = function(payload) {
;;;         self.logger.debug('received', payload);
            switch(payload[0]) {
                case 'initialized':
                    queue.push([method, url, data, requestHeaders]);
;;;                 self.logger.debug('queue is', queue);
;;;                 self.logger.debug('Orbited.singleton.XSDR.queues[id] is', Orbited.singleton.XSDR.queues[id]);
                    break;
                case 'readystatechange':
                    data = payload[1];
                    self.readyState = data.readyState;
;;;                 self.logger.debug('readystatechange', self.readyState);
                    if (data.status) {
                        self.status = data.status;
;;;                     self.logger.debug('status', data.status);
                    }
                    if (data.responseText) {
                        self.responseText += data.responseText;
;;;                     self.logger.debug('responseText', data.responseText);
                    }
;;;                 self.logger.debug('doing trigger');
                    self.onreadystatechange();
;;;                 self.logger.debug('trigger complete');
                    break;
            }
        };

        var hideIframe =function (ifr) {
            ifr.style.display = 'block';
            ifr.style.width = '0';
            ifr.style.height = '0';
            ifr.style.border = '0';
            ifr.style.margin = '0';
            ifr.style.padding = '0';
            ifr.style.overflow = 'hidden';
            ifr.style.visibility = 'hidden';
        };

    };

    if (Orbited.util.browser == "opera") {
        var pmLocation = window.postMessage && "contentWindow" || "document";
        (window.postMessage && window || document).addEventListener('message', function(e) {
            var msg = e.data.split(" ");
            var cmd = msg.shift();
            if (cmd == "event") {
                var id = msg.shift();
                var dataString = msg.join(" ");
                var data = Orbited.JSON.parse(dataString);
                Orbited.singleton.XSDR.receiveCbs[id](data);
            }
            if (cmd == "queues") {
                id = msg.shift();
                var queue = Orbited.singleton.XSDR.queues[id];
                if (queue.length > 0) {
                    data = queue.shift();
                    Orbited.singleton.XSDR.iframes[id][pmLocation].postMessage(Orbited.JSON.stringify(data), e.origin);
                }
            }
        }, false);
    }

    Orbited.XSDR.prototype.logger = Orbited.getLogger("Orbited.XSDR");
    Orbited.singleton.XSDRBridgeLogger = Orbited.getLogger('XSDRBridge');

    /* Comet Transports!
 */
    var CT_READYSTATE_INITIAL = 0;
    var CT_READYSTATE_OPEN      = 1;
    var CT_READYSTATE_CLOSED  = 2;

    Orbited.CometTransports.XHRStream = function() {
        var self = this;
        self.name = 'xhrstream';
        var url = null;
        var xhr = null;
        var ackId = null;
        var offset = 0;
        var heartbeatTimer = null;
        var retryTimer = null;
        var buffer = "";
        var retryInterval = 50;
        self.readyState = CT_READYSTATE_INITIAL;
        self.onReadFrame = function(frame) {};
        self.onread = function(packet) { self.onReadFrame(packet); };
        self.onclose = function() { };

        self.close = function() {
            if (self.readyState == CT_READYSTATE_CLOSED) {
                return;
            }
            if (xhr != null && (xhr.readyState > 1 || xhr.readyState < 4)) {
                xhr.onreadystatechange = function() { };
                xhr.abort();
                xhr = null;
            }
            self.readyState = CT_READYSTATE_CLOSED;
            window.clearTimeout(heartbeatTimer);
            window.clearTimeout(retryTimer);
            self.onclose();
        };

        self.connect = function(_url) {
            if (self.readyState == CT_READYSTATE_OPEN) {
                throw new Error("Already Connected");
            }
            url = new Orbited.URL(_url);
            if (xhr == null) {
                if (url.isSameDomain(location.href)) {
                    xhr = createXHR();
                }
                else {
                    xhr = new Orbited.XSDR();
                }
            }
            url.path += '/xhrstream';
            self.readyState = CT_READYSTATE_OPEN;
            open();
        };
        var open = function() {
            try {
                if (typeof(ackId) == "number") {
                    url.setQsParameter('ack', ackId);
                }
                if (typeof(xhr)== "undefined" || xhr == null) {
                    throw new Error("how did this happen?");
                }
                if (Orbited.settings.enableFFPrivileges) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                    }
                    catch (ex) { }
                }

                xhr.open('GET', url.render(), true);
                xhr.onreadystatechange = function() {
;;;                 self.logger.debug(xhr.readyState);
                    if (self.readyState == CT_READYSTATE_CLOSED) {
                        return;
                    }
                    switch(xhr.readyState) {
                        case 2:
                            try {
                                var status = xhr.status;
                            }
                            catch(e) {
                                return;
                            }
                            if (status == 200) {
                                try {
                                    heartbeatTimer = window.setTimeout(heartbeatTimeout, Orbited.settings.HEARTBEAT_TIMEOUT);
                                }
                                catch(e) {
                                    self.close();
                                    return;
                                }
                                var testtimer = heartbeatTimer;
                            }
                            break;
                        case 3:
                            try {
                                var status = xhr.status;
                            }
                            catch(e) {
                                return;
                            }
                            if (status == 200) {
                                retryInterval = 50;
                                process();
                            }
                            break;
                        case 4:
                            var doReconnect = true;
                            try {
                                if (xhr.status === null) {
                                    doReconnect = true;
                                }
                                else {
                                    doReconnect = false;
                                }
                            }
                            catch(e) {
                            }
                            if (doReconnect) {
                                retryInterval *= 2;
                                window.clearTimeout(heartbeatTimer);
                                retryTimer = window.setTimeout(reconnect, retryInterval);
                                return;
                            }
                            switch(xhr.status) {
                                case 200:
                                    process();
                                    offset = 0;
                                    setTimeout(open, 0);
                                    window.clearTimeout(heartbeatTimer);
                                    break;
                                case 404:
                                    self.close();
                                    break;
                                default:
                                    self.close();
                                    break;
                            }
                            break;
                    }
                };
                xhr.send(null);
            }
            catch(e) {
                self.close();
            }
        };

        var reconnect = function() {
;;;         self.logger.debug('reconnect...')
            if (xhr.readyState < 4 && xhr.readyState > 0) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                reconnect();
                }
            };
;;;         self.logger.debug('do abort..')
            xhr.abort();
            window.clearTimeout(heartbeatTimer);
            }
            else {
;;;         self.logger.debug('reconnect do open');
            offset = 0;
            setTimeout(open, 0);
            }
        };
        var commaPos = -1;
        var argEnd = null;
        var frame = [];
        var process = function() {
            var stream = xhr.responseText;
            receivedHeartbeat();

            while (stream[offset] == ' ') {
            offset += 1;
            }
            while (stream[offset] == 'x') {
            offset += 1;
            }

            var k = 0;
            while (true) {
            k += 1;
            if (k > 2000) {
                throw new Error("Borked XHRStream transport");
            }
            if (commaPos == -1) {
                commaPos = stream.indexOf(',', offset);
            }
            if (commaPos == -1) {
                return;
            }
            if (argEnd == null) {
                argSize = parseInt(stream.slice(offset+1, commaPos));
                argEnd = commaPos +1 + argSize;
            }

            if (stream.length < argEnd) {
                return;
            }
            var data = stream.slice(commaPos+1, argEnd);
            frame.push(data);
            var isLast = (stream.charAt(offset) == '0');
            offset = argEnd;
            argEnd = null;
            commaPos = -1;
            if (isLast) {
                var frameCopy = frame;
                frame = [];
                receivedPacket(frameCopy);
            }
            }

        };
        var receivedHeartbeat = function() {
            window.clearTimeout(heartbeatTimer);
;;;         self.logger.debug('clearing heartbeatTimer', heartbeatTimer);
            try {
            heartbeatTimer = window.setTimeout(function() {
;;;             self.logger.debug('timer', testtimer, 'did it');
                heartbeatTimeout();
            }, Orbited.settings.HEARTBEAT_TIMEOUT);
            }
            catch(e) {
            return;
            }
            var testtimer = heartbeatTimer;

;;;         self.logger.debug('heartbeatTimer is now', heartbeatTimer);
        };
        var heartbeatTimeout = function() {
;;;         self.logger.debug('heartbeat timeout... reconnect');
            reconnect();
        };
        var receivedPacket = function(args) {
            var testAckId = parseInt(args[0]);
            if (!isNaN(testAckId)) {
            ackId = testAckId;
            }
            var packet = {
            id: testAckId,
            name: args[1],
            data: args[2]
            };
            self.onread(packet);
        };
    };
    Orbited.CometTransports.XHRStream.prototype.logger = Orbited.getLogger("Orbited.CometTransports.XHRStream");
    Orbited.CometTransports.XHRStream.firefox = 1.0;
    Orbited.CometTransports.XHRStream.firefox2 = 1.0;
    Orbited.CometTransports.XHRStream.firefox3 = 1.0;
    Orbited.CometTransports.XHRStream.safari2 = 1.0;
    Orbited.CometTransports.XHRStream.safari3 = 1.0;





    Orbited.CometTransports.LongPoll = function() {
        var self = this;
        self.name = 'longpoll';
        var url = null;
        var xhr = null;
        var ackId = null;
        var retryTimer = null;
        var buffer = "";
        var retryInterval = 50;
        self.readyState = CT_READYSTATE_INITIAL;
        self.onReadFrame = function(frame) {};
        self.onclose = function() { };

        self.close = function() {
;;;         self.logger.debug('close');
            if (self.readyState == CT_READYSTATE_CLOSED) {
                return;
            }
            if (xhr != null && (xhr.readyState > 1 || xhr.readyState < 4)) {
                xhr.onreadystatechange = function() { };
                xhr.abort();
                xhr = null;
            }
;;;         self.logger.debug('close! self.readyState now is 2');
            self.readyState = CT_READYSTATE_CLOSED;
            window.clearTimeout(retryTimer);
            self.onclose();
        };

        self.connect = function(_url) {
;;;         self.logger.debug('connect');
            if (self.readyState == CT_READYSTATE_OPEN) {
                throw new Error("Already Connected");
            }
            url = new Orbited.URL(_url);
            if (xhr == null) {
                if (url.isSameDomain(location.href)) {
                    xhr = createXHR();
                }
                else {
                    xhr = new Orbited.XSDR();
                }
            }
            url.path += '/longpoll';
            self.readyState = CT_READYSTATE_OPEN;
            open();
        };
        var open = function() {
;;;         self.logger.debug('open... self.readyState = ' + self.readyState);
            if (self.readyState == CT_READYSTATE_CLOSED) {
                return;
            }
            try {
                if (typeof(ackId) == "number") {
                    url.setQsParameter('ack', ackId);
                }
                if (typeof(xhr)== "undefined" || xhr == null) {
                    throw new Error("how did this happen?");
                }
                if (Orbited.settings.enableFFPrivileges) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                    }
                    catch (ex) { }
                }
                xhr.open('GET', url.render(), true);
                xhr.onreadystatechange = function() {
;;;                 self.logger.debug('readystate', xhr.readyState);
                    switch(xhr.readyState) {
                        case 4:
                            try {
                                var test = xhr.status;
                            }
                            catch(e) {
;;;                             self.logger.debug("start reconnect Timer (couldn't access xhr.status)");
                                retryInterval *= 2;
                                window.setTimeout(reconnect, retryInterval);
                                return;
                            }
                            switch(xhr.status) {
                                case 200:
                                    self.timeoutResetter();
                                    process();
;;;                                 self.logger.debug("completed request, reconnect immediately");
                                    setTimeout(open, 0);
                                    break;
                                case 404:
                                    self.close();
                                    break;
                                case null:
                                    retryInterval *= 2;
;;;                                 self.logger.debug("start reconnect Timer (null xhr.status)");
                                    window.setTimeout(reconnect, retryInterval);
                                    break;
                                default:
;;;                                 self.logger.debug("something broke, xhr.status=", xhr.status);
                                    self.close();
                                    break;
                            }
                            break;
                    }
                };
                xhr.send(null);
            }
            catch(e) {
                self.close();
            }
        };

        var reconnect = function() {
;;;         self.logger.debug('reconnect...');
            if (xhr.readyState < 4 && xhr.readyState > 0) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        reconnect();
                    }
                };
;;;             self.logger.debug('do abort..');
                xhr.abort();
                window.clearTimeout(heartbeatTimer);
            }
            else {
;;;             self.logger.debug('reconnect do open');
                offset = 0;
                setTimeout(open, 0);
            }
        };
        var process = function() {
;;;         self.logger.debug('process');
            var commaPos = -1;
            var argEnd = null;
            var argSize;
            var frame = [];
            var stream = xhr.responseText;
            var offset = 0;


            var k = 0;
            while (true) {
                k += 1;
                if (k > 2000) {
                    throw new Error("Borked XHRStream transport");
                }
                if (commaPos == -1) {
                    commaPos = stream.indexOf(',', offset);
                }
                if (commaPos == -1) {
;;;                 self.logger.debug('no more commas. offset:', offset, 'stream.length:', stream.length);
                    return;
                }
                if (argEnd == null) {
                    argSize = parseInt(stream.slice(offset+1, commaPos));
                    argEnd = commaPos +1 + argSize;
                }
;;;             self.logger.assert(true);
                /*          if (stream.length < argEnd) {
                return
                }*/
                var data = stream.slice(commaPos+1, argEnd);
;;;             self.logger.assert(data.length == argSize, 'argSize:', argSize, 'data.length', data.length);
                if (data.length != argSize) {
                    DEBUGDATA = stream;
                }
                frame.push(data);
                var isLast = (stream.charAt(offset) == '0');
                offset = argEnd;
                argEnd = null;
                commaPos = -1;
                if (isLast) {
                    var frameCopy = frame;
                    frame = [];
                    receivedPacket(frameCopy);
                }
            }

        };
        var receivedPacket = function(args) {
            var testAckId = parseInt(args[0]);
;;;         self.logger.debug('args', args);
            if (!isNaN(testAckId)) {
                ackId = testAckId;
            }
;;;         self.logger.debug('testAckId', testAckId, 'ackId', ackId);
            var packet = {
                id: testAckId,
                name: args[1],
                data: args[2]
            };
            self.onReadFrame(packet);
        };
    };
    Orbited.CometTransports.LongPoll.prototype.logger = Orbited.getLogger("Orbited.CometTransports.LongPoll");
    /*
Orbited.CometTransports.LongPoll.firefox = 0.9
Orbited.CometTransports.LongPoll.firefox2 = 0.9
Orbited.CometTransports.LongPoll.firefox3 = 0.9
Orbited.CometTransports.LongPoll.safari2 = 0.9
Orbited.CometTransports.LongPoll.safari3 = 0.9
Orbited.CometTransports.LongPoll.opera = 0.9
Orbited.CometTransports.LongPoll.ie = 0.9
*/



    Orbited.CometTransports.Poll = function() {
        var self = this;
        self.name = 'poll';


        var url = null;
        var xhr = null;
        var ackId = null;
        var retryTimer = null;
        var buffer = "";
        var baseRetryInterval = Orbited.settings.POLL_INTERVAL;
        var retryInterval = baseRetryInterval;
        self.readyState = CT_READYSTATE_INITIAL;
        self.onReadFrame = function(frame) {};
        self.onclose = function() { };

        self.close = function() {
;;;         self.logger.debug('close...');
            if (self.readyState == CT_READYSTATE_CLOSED) {
                return;
            }
            if (xhr != null && (xhr.readyState > 1 || xhr.readyState < 4)) {
                xhr.onreadystatechange = function() { };
                xhr.abort();
                xhr = null;
            }
            self.readyState = CT_READYSTATE_CLOSED;
            window.clearTimeout(retryTimer);
            self.onclose();
        };

        self.connect = function(_url) {
;;;         self.logger.debug('connect...');
            if (self.readyState == CT_READYSTATE_OPEN) {
                throw new Error("Already Connected");
            }
            url = new Orbited.URL(_url);
            if (xhr == null) {
                if (url.isSameDomain(location.href)) {
                    xhr = createXHR();
                }
                else {
                    xhr = new Orbited.XSDR();
                }
            }
            url.path += '/poll';
            self.readyState = CT_READYSTATE_OPEN;
            open();
        };
        var open = function() {
;;;         self.logger.debug('open...');
            try {
                if (typeof(ackId) == "number") {
                    url.setQsParameter('ack', ackId);
                }
                if (typeof(xhr)== "undefined" || xhr == null) {
                    throw new Error("how did this happen?");
                }

                if (Orbited.settings.enableFFPrivileges) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
                    } catch (ex) { }
                }
                xhr.open('GET', url.render(), true);
                xhr.onreadystatechange = function() {
                    switch(xhr.readyState) {
                        case 4:
                            try {
                                var test = xhr.status;
                            }
                            catch(e) {
                                retryInterval *= 2;
                                window.setTimeout(reconnect, retryInterval);
                                return;
                            }
                            switch(xhr.status) {
                                case 200:
                                    self.timeoutResetter();
                                    retryInterval = baseRetryInterval;
                                    process();
                                    setTimeout(open, retryInterval);
                                    break;
                                case 404:
                                    self.close();
                                    break;
                                case null:
                                    retryInterval *= 2;
                                    window.setTimeout(reconnect, retryInterval);
                                    break;
                                default:
                                    self.close();
                                    break;
                            }
                            break;
                    }
                };
                xhr.send(null);
            }
            catch(e) {
                self.close();
            }
        };

        var reconnect = function() {
;;;         self.logger.debug('reconnect...');
            if (xhr.readyState < 4 && xhr.readyState > 0) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        reconnect();
                    }
                };
;;;             self.logger.debug('do abort..');
                xhr.abort();
                window.clearTimeout(heartbeatTimer);
            } else {
;;;             self.logger.debug('reconnect do open');
                offset = 0;
                setTimeout(open, 0);
            }
        };
        var process = function() {
;;;         self.logger.debug('process...');
            var commaPos = -1;
            var argEnd = null;
            var argSize;
            var frame = [];
            var stream = xhr.responseText;
            var offset = 0;

            var k = 0;

            while (true) {
                k += 1;
                if (k > 2000) {
                    throw new Error("Borked XHRStream transport");
                }
                if (commaPos == -1) {
                    commaPos = stream.indexOf(',', offset);
                }
                if (commaPos == -1) {
;;;                 self.logger.debug('no more commas. offset:', offset, 'stream.length:', stream.length);
                    return;
                }

                if (argEnd == null) {
                    argSize = parseInt(stream.slice(offset+1, commaPos));
                    argEnd = commaPos +1 + argSize;
                }
                /*          if (stream.length < argEnd) {
                return
                }*/
                var data = stream.slice(commaPos+1, argEnd);
;;;             self.logger.assert(data.length == argSize, 'argSize:', argSize, 'data.length', data.length);
                if (data.length != argSize) {
                    DEBUGDATA = stream;
                }
                frame.push(data);
                var isLast = (stream.charAt(offset) == '0');
                offset = argEnd;
                argEnd = null;
                commaPos = -1;
                if (isLast) {
                    var frameCopy = frame;
                    frame = [];
                    receivedPacket(frameCopy);
                }
            }

        };
        var receivedPacket = function(args) {
;;;         self.logger.debug('receivedPacket...');
            var testAckId = parseInt(args[0]);
;;;         self.logger.debug('args', args);
            if (!isNaN(testAckId)) {
            ackId = testAckId;
            }
;;;         self.logger.debug('testAckId', testAckId, 'ackId', ackId);
            var packet = {
            id: testAckId,
            name: args[1],
            data: args[2]
            };
            self.onReadFrame(packet);
        };
    };
    Orbited.CometTransports.Poll.prototype.logger = Orbited.getLogger("Orbited.CometTransports.Poll");

    /*Orbited.CometTransports.Poll.firefox = 0.5
Orbited.CometTransports.Poll.opera = 0.5
Orbited.CometTransports.Poll.ie = 0.5
*/





    Orbited.CometTransports.HTMLFile = function() {
        var self = this;
        self.name = 'htmlfile';
        var id = ++Orbited.singleton.HTMLFile.i;
        Orbited.singleton.HTMLFile.instances[id] = self;
        var htmlfile = null;
        var ifr = null;
        var url = null;
        var restartUrl = null;
        var restartTimer = null;
        var baseRestartTimeout = 2000;
        var restartTimeout = baseRestartTimeout;
        self.onReadFrame = function(frame) {};
        self.onread = function(packet) { self.onReadFrame(packet); };
        self.onclose = function() { };
        self.connect = function(_url) {
            if (self.readyState == CT_READYSTATE_OPEN) {
            throw new Error("Already Connected");
            }
            self.logger.debug('self.connect', _url);
            url = new Orbited.URL(_url);
            url.path += '/htmlfile';
            url.setQsParameter('frameID', id.toString());
            self.readyState = CT_READYSTATE_OPEN;
            doOpen(url.render());
        };

        var doOpenIfr = function() {

            var ifr = document.createElement('iframe');
            ifr.src = url.render();
            document.body.appendChild(ifr);
        };

        var doOpen = function(_url) {
;;;         self.logger.debug('doOpen', _url);
            htmlfile = new ActiveXObject('htmlfile'); // magical microsoft object
            htmlfile.open();
            if (self.isSubDomain) {
                htmlfile.write('<html><script>' + 'document.domain="' + document.domain + '";' + '</script></html>');
            }
            else {
                htmlfile.write('<html></html>');
            }
            htmlfile.parentWindow.Orbited = Orbited;
            htmlfile.close();
            var iframe_div = htmlfile.createElement('div');
            htmlfile.body.appendChild(iframe_div);
            ifr = htmlfile.createElement('iframe');
            iframe_div.appendChild(ifr);
            ifr.src = _url;
            restartUrl = _url;
            restartTimer = window.setTimeout(reconnect, restartTimeout);
        };

        self.restartingStream = function(_url) {
            restartUrl = _url;
            restartTimer = window.setTimeout(reconnect, restartTimeout);
        };

        var reconnect = function() {
;;;         self.logger.debug('doing reconnect... ' + restartTimeout);
            restartTimeout*=2;
            ifr.src = restartUrl;
          restartTimer = window.setTimeout(reconnect, restartTimeout);
        };

        self.streamStarted = function() {
;;;         self.logger.debug('stream started..');
            window.clearTimeout(restartTimer);
            restartTimer = null;
            restartTimeout = baseRestartTimeout;
        };

        self.streamClosed = function() {
;;;         self.logger.debug('stream closed!');
            window.clearTimeout(restartTimer);
            self.close();
        };

        self.receive = function(id, name, data) {
            packet = {
            id: id,
            name: name,
            data: data
            };
            self.onread(packet);
        };

        self.close = function() {
            if (self.readyState == CT_READYSTATE_CLOSED) {
            return;
            }
;;;         self.logger.debug('close called, clearing timer');
            window.clearTimeout(restartTimer);
            self.readyState = CT_READYSTATE_CLOSED;
            ifr.src = 'about:blank';
            htmlfile = null;
            CollectGarbage();
            self.onclose();
        };

    };
    Orbited.CometTransports.HTMLFile.prototype.logger = Orbited.getLogger("Orbited.CometTransports.HTMLFile");
    Orbited.CometTransports.HTMLFile.ie = 1.0;
    Orbited.singleton.HTMLFile = {
        i: 0,
        instances: {}
    };




    Orbited.CometTransports.SSE = function() {
        var self = this;
        self.name = 'sse';
        self.onReadFrame = function(frame) {};
        self.onclose = function() { };
        self.readyState = CT_READYSTATE_INITIAL;
        var heartbeatTimer = null;
        var source = null;
        var url = null;
        var lastEventId = -1;

        self.close = function() {
            if (self.readyState == CT_READYSTATE_CLOSED) {
                return;
            }
            self.readyState = CT_READYSTATE_CLOSED;
            doClose();
            self.onclose();
        };

        self.connect = function(_url) {
            if (self.readyState == CT_READYSTATE_OPEN) {
                throw new Error("Already Connected");
            }
            url = new Orbited.URL(_url);
            url.path += '/sse';
            self.readyState = CT_READYSTATE_OPEN;
            doOpen();
        };
        doClose = function() {
            source.removeEventSource(source.getAttribute('src'));
            source.setAttribute('src',"");
            if (opera.version() < 9.5) {
                document.body.removeChild(source);
            }
            source = null;
        };
        doOpen = function() {
            /*
        if (typeof(lastEventId) == "number") {
            url.setQsParameter('ack', lastEventId)
        }
*/
            source = document.createElement("event-source");
            source.setAttribute('src', url.render());
            if (opera.version() < 9.5) {
            document.body.appendChild(source);
            }
            source.addEventListener('payload', receivePayload, false);

        };

        var receivePayload = function(event) {
            var data = eval(event.data);
            if (typeof(data) != 'undefined') {
            for (var i = 0; i < data.length; ++i) {
                var packet = data[i];
                receive(packet[0], packet[1], packet[2]);
            }
            }

        };
        /*    var receiveHeartbeat = function() {
               window.clearTimeout(heartbeatTimer);
               heartbeatTimer = window.setTimeout(reconnect, Orbited.settings.HEARTBEAT_TIMEOUT)
              }      */
        var receive = function(id, name, data) {
            var tempId = parseInt(id);
            if (!isNaN(tempId)) {
            lastEventId = tempId;
            }
            packet = {
            id: id,
            name: name,
            data: data
            };
            self.onReadFrame(packet);
        };
    };
    Orbited.CometTransports.SSE.prototype.logger = Orbited.getLogger("Orbited.CometTransports.SSE");

    Orbited.CometTransports.SSE.opera = 1.0;
    Orbited.CometTransports.SSE.opera8 = 1.0;
    Orbited.CometTransports.SSE.opera9 = 1.0;
    Orbited.CometTransports.SSE.opera9_5 = 0.8;



    /* This is an old implementation of the URL class. Jacob is cleaning it up
 * -mcarter, 7-30-08
 *
 * Jacob is actually throwing this away and rewriting from scratch
 * -mcarter 11-14-08
 */
    Orbited.URL = function(_url) {
        var self = this;
        var protocolIndex = _url.indexOf("://");
        if (protocolIndex != -1) self.protocol = _url.slice(0,protocolIndex);
        else protocolIndex = -3;

        var domainIndex = _url.indexOf('/', protocolIndex+3);
        if (domainIndex == -1) domainIndex=_url.length;

        var hashIndex = _url.indexOf("#", domainIndex);
        if (hashIndex != -1) self.hash = _url.slice(hashIndex+1);
        else hashIndex = _url.length;

        var uri = _url.slice(domainIndex, hashIndex);
        var qsIndex = uri.indexOf('?');
        if (qsIndex == -1) qsIndex=uri.length;

        self.path = uri.slice(0, qsIndex);
        self.qs = uri.slice(qsIndex+1);
        if (self.path == "") self.path = "/";

        var domain = _url.slice(protocolIndex+3, domainIndex);
        var portIndex = domain.indexOf(":");
        if (portIndex == -1) {
            self.port = 80;
            portIndex = domain.length;
        }
        else {
            self.port = parseInt(domain.slice(portIndex+1));
        }
        if (isNaN(this.port)) throw new Error("Invalid _url");

        self.domain = domain.slice(0, portIndex);

        self.render = function() {
            var output = "";
            if (typeof(self.protocol) != "undefined")
            output += self.protocol + "://";
            output += self.domain;
            if (self.port != 80 && typeof(self.port) != "undefined" && self.port != null)
            if (typeof(self.port) != "string" || self.port.length > 0)
                output += ":" + self.port;
            if (typeof(self.path) == "undefined" || self.path == null)
            output += '/';
            else
            output += self.path;
            if (self.qs.length > 0)
            output += '?' + self.qs;
            if (typeof(self.hash) != "undefined" && self.hash.length > 0)
            output += "#" + self.hash;
            return output;
        };
        self.isSamePort = function(_url) {
            _url = new Orbited.URL(_url);
            return _url.port == self.port;
        }
        self.isSameDomain = function(_url) {
            _url = new Orbited.URL(_url);

            if (!_url.domain || !self.domain)
            return true;
            return (_url.port == self.port && _url.domain == self.domain);
        };
        self.isSameParentDomain = function(_url) {
            _url = new Orbited.URL(_url);
            if (_url.domain == self.domain) {
            return true;
            }
            var orig_domain = _url.domain;
            var parts = document.domain.split('.');
            for (var i = 0; i < parts.length-1; ++i) {
            var new_domain = parts.slice(i).join(".");
            if (orig_domain == new_domain)
                return true;
            }
            return false;
        };
        self.isSubDomain = function(_url) {
            _url = new Orbited.URL(_url);
            if (!_url.domain || !self.domain) {
                return false;
            }
            return (_url.port == self.port && self.domain.indexOf("."+_url.domain) > 0);
        };
        var decodeQs = function(qs) {
            if (qs.indexOf('=') == -1) return {};
            var result = {};
            var chunks = qs.split('&');
            for (var i = 0; i < chunks.length; ++i) {
            var cur = chunks[i];
            var pieces = cur.split('=');
            result[pieces[0]] = pieces[1];
            }
            return result;
        };
        var encodeQs = function(o) {
            var output = "";
            for (var key in o)
            output += "&" + key + "=" + o[key];
            return output.slice(1);
        };
        self.setQsParameter = function(key, val) {
            var curQsObj = decodeQs(self.qs);
            curQsObj[key] = val;
            self.qs = encodeQs(curQsObj);
        };

        self.mergeQs = function(qs) {
            var newQsObj = decodeQs(qs);
            for (key in newQsObj) {
            curQsObj[key] = newQsObj[key];
            }
        };
        self.removeQsParameter = function(key) {
            var curQsObj = decodeQs(self.qs);
            delete curQsObj[key];
            self.qs = encodeQs(curQsObj);
        };

        self.merge = function(targetUrl) {
            if (typeof(self.protocol) != "undefined" && self.protocol.length > 0) {
            self.protocol = targetUrl.protocol;
            }
            if (targetUrl.domain.length > 0) {
            self.domain = targetUrl.domain;
            self.port = targetUrl.port;
            }
            self.path = targetUrl.path;
            self.qs = targetUrl.qs;
            self.hash = targetUrl.hash;
        };

    };

    Orbited.utf8 = {};
    Orbited.utf8.decode = function(s) {
        var ret = [];
        var j = 0;
        function pad6(str) {
            while(str.length < 6) { str = "0" + str; } return str;
        }
        for (var i=0; i < s.length; i++) {
            if ((s.charCodeAt(i) & 0xf8) == 0xf0) {
                if (s.length -j < 4) { break; }
                j+=4;
                ret.push(String.fromCharCode(parseInt(
                    (s.charCodeAt(i) & 0x07).toString(2) +
                    pad6((s.charCodeAt(i+1) & 0x3f).toString(2)) +
                    pad6((s.charCodeAt(i+2) & 0x3f).toString(2)) +
                    pad6((s.charCodeAt(i+3) & 0x3f).toString(2))
                    , 2)));
                i += 3;
            } else if ((s.charCodeAt(i) & 0xf0) == 0xe0) {
                if (s.length -j < 3) { break; }
                j+=3;
                ret.push(String.fromCharCode(parseInt(
                    (s.charCodeAt(i) & 0x0f).toString(2) +
                    pad6((s.charCodeAt(i+1) & 0x3f).toString(2)) +
                    pad6((s.charCodeAt(i+2) & 0x3f).toString(2))
                    , 2)));
                i += 2;
            } else if ((s.charCodeAt(i) & 0xe0) == 0xc0) {
                if (s.length -j < 2) { break }
                j+=2;
                ret.push(String.fromCharCode(parseInt(
                    (s.charCodeAt(i) & 0x1f).toString(2) +
                    pad6((s.charCodeAt(i+1) & 0x3f).toString(2), 6)
                    , 2)));
                i += 1;
            } else {
                j+=1;
                ret.push(String.fromCharCode(s.charCodeAt(i)));
            }
        }
        return [ret.join(""), j];
    };

    Orbited.utf8.encode = function(text) {
        var ret = [];

        function pad(str, len) {
            while(str.length < len) { str = "0" + str; } return str;
        }
        var e = String.fromCharCode;
        for (var i=0; i < text.length; i++) {
            var chr = text.charCodeAt(i);
            if (chr <= 0x7F) {
            ret.push(e(chr));
            } else if(chr <= 0x7FF) {
            var binary = pad(chr.toString(2), 11);
            ret.push(e(parseInt("110"    + binary.substr(0,5), 2)));
            ret.push(e(parseInt("10"    + binary.substr(5,6), 2)));
            } else if(chr <= 0xFFFF) {
            var binary = pad(chr.toString(2), 16);
            ret.push(e(parseInt("1110"    + binary.substr(0,4), 2)));
            ret.push(e(parseInt("10"    + binary.substr(4,6), 2)));
            ret.push(e(parseInt("10"    + binary.substr(10,6), 2)));
            } else if(chr <= 0x10FFFF) {
            var binary = pad(chr.toString(2), 21);
            ret.push(e(parseInt("11110" + binary.substr(0,3), 2)));
            ret.push(e(parseInt("10"    + binary.substr(3,6), 2)));
            ret.push(e(parseInt("10"    + binary.substr(9,6), 2)));
            ret.push(e(parseInt("10"    + binary.substr(15,6), 2)));
            }
        }
        return ret.join("");
    };

        /*
         * We create Orbited.JSON whether or not some other JSON
         * exists. This is because Orbited.JSON is compatible with
         * JSON.js (imported by xsdrBridge), whereas various other
         * JSONs, including the one that ships with Prototype, are
         * not, leading to dumb errors.
         *     -mario
         */

        Orbited.JSON = function () {

            function f(n) {
            return n < 10 ? '0' + n : n;
            }

            Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())       + 'T' +
                f(this.getUTCHours())       + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z';
            };

            String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };

            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
            },
            rep;


            function quote(string) {


            escapeable.lastIndex = 0;
            return escapeable.test(string) ?
                '"' + string.replace(escapeable, function (a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                return '\\u' + ('0000' +
                        (+(a.charCodeAt(0))).toString(16)).slice(-4);
                }) + '"' :
            '"' + string + '"';
            }


            function str(key, holder) {


            var i,        // The loop counter.
            k,        // The member key.
            v,        // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];


            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }


            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }


            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':


                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':


                return String(value);


            case 'object':


                if (!value) {
                return 'null';
                }


                gap += indent;
                partial = [];


                if (typeof value.length === 'number' &&
                !(value.propertyIsEnumerable('length'))) {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }


                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                    partial.join(',\n' + gap) + '\n' +
                    mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
                }


                if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                    }
                }
                } else {


                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                    }
                    }
                }
                }


                v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
            }


            return {
            stringify: function (value, replacer, space) {


                var i;
                gap = '';
                indent = '';


                if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


                } else if (typeof space === 'string') {
                indent = space;
                }


                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                 typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
                }


                return str('', {'': value});
            },


            parse: function (text, reviver) {


                var j;

                function walk(holder, key) {


                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                        value[k] = v;
                        } else {
                        delete value[k];
                        }
                    }
                    }
                }
                return reviver.call(holder, key, value);
                }



                cx.lastIndex = 0;
                if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' +
                            (+(a.charCodeAt(0))).toString(16)).slice(-4);
                });
                }



                if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                             replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                    j = eval('(' + text + ')');


                    return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
                }


                          throw new SyntaxError('JSON.parse');
                         }
                    };
                   }();
            })();


        (function() {
            try {
            var scripts = document.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; ++i) {
                var script = scripts[i];
                if (script.src.match('/static/Orbited\.js$')) {
                var url = new Orbited.URL(script.src);
                if (url.render().indexOf('http') != 0) {
                    var url = new Orbited.URL(window.location.toString());
                }
                Orbited.settings.hostname = url.domain;
                Orbited.settings.port = url.port;
                break;
                }
            }
            } catch(e) {
            }
        })();
Talker.Client = function(options) {
  var self = this;
  var callbacks = options.callbacks;
  var protocol = null;
  var pingTimer = null;
  var pingInterval = 10000;
  var reconnectInterval = 2000;
  var reconnect = true;
  var requestingToken = false;
  var lastEventId = options.lastEventId;
  var parentCallback = options.parentCallback;

  function onLineReceived(line) {
    parentCallback && parentCallback(line);

    try {
      var line = eval('(' + line + ')');
    } catch (SyntaxError) {
      return;
    }

    self.lastEventId = line.id;

    switch(line.type){
      case 'message':
        callbacks.onMessageReceived(line);
        break;
      case 'join':
        callbacks.onJoin(line);
        break;
      case 'users':
        callbacks.onUsers(line);
        break;
      case 'leave':
        callbacks.onLeave(line);
        break;
      case 'error':
        callbacks.onError(line);
        break;
      case 'back':
        callbacks.onBack(line);
        break;
      case 'idle':
        callbacks.onIdle(line);
        break;
      case 'connected':
        callbacks.onConnected(line);
        break;
      case 'token':
        requestingToken = false;
        if (line.acquired) {
          callbacks.onToken(line);
        } else {
          setTimeout(self.acquireToken, 200);
        }

        break;
      default:
        console.warn("Unknown message type (client error): " + line.type);
    }
  }

  self.resetPing = function() {
    self.stopPing();
    pingTimer = setInterval(function(){ self.ping(); }, pingInterval);
  };

  self.stopPing = function() {
    if (pingTimer) clearInterval(pingTimer);
  };

  self.ping = function(){
    protocol.send(JSON.encode({type: 'ping'}));
  };

  self.sendData = function(message) {
    protocol.send(JSON.encode(message));
  };

  self.acquireToken = function() {
    if (requestingToken) return;
    requestingToken = true;
    self.sendData({type: "token"});
  };

  self.connect = function() {
    try {
      $("iframe[src*='xsdrBridge.html']").remove();
      protocol = new LineProtocol(new TCPSocket());

      protocol.onopen = function() {
        self.sendData({
          type: "connect",
          room: options.room,
          paste: options.paste,
          token: options.token,
          last_event_id: self.lastEventId
        });
        callbacks.onOpen();
        self.resetPing();
      }

      protocol.onclose = function() {
        self.stopPing();
        callbacks.onClose();
        self.reconnect();
      }

      protocol.onerror = function(error) {
        self.stopPing();
        callbacks.onError({message: error});
        self.reconnect();
      }

      protocol.onlinereceived = onLineReceived;
      protocol.open(options.host, options.port, false);
    } catch (e) {
      self.reconnect();
    }

    return self;
  };

  self.reconnect = function() {
    if (reconnect) {
      setTimeout(function() { self.connect() }, reconnectInterval);
    }
  };

  self.close = function(callback) {
    reconnect = false;
    if (callback) callbacks.onClose = callback;
    self.sendData({type: "close"});
  };

  self.reset = function() {
    callbacks.onClose = function() {};
    protocol.reset();
  };

  self.send = function(message) {
    message.type = "message";
    self.sendData(message);
  };

  var queueTimeout = null;
  self.queueSend = function(message, callback, timeout) {
    if (queueTimeout) {
      clearTimeout(queueTimeout);
    }
    queueTimeout = setTimeout(function() {
      self.send(message);
      callback();
    }, timeout || 1000);
  }
}
Talker.sentCount = 0;

Talker.sendMessage = function(message) {
  var talkerEvent = {
    id: 'pending',
    type: 'message',
    user: Talker.currentUser,
    time: parseInt(new Date().getTime() / 1000),
    paste: false
  };

  if (typeof message == 'string'){
    talkerEvent.content = message;
  } else {
    $.extend(true, talkerEvent, message);
  }

  Talker.client.send(talkerEvent);
  Talker.trigger('MessageReceived', talkerEvent);
};

Talker.sendAction = function(message, options) {
  Talker.sendMessage($.extend({content: message, action: true}, options));
};

Talker.insertMessage = function(talkerEvent, content) {
  if (content) {
    talkerEvent.content = content;
  }

  var lastInsertion = Talker.lastInsertionEvent;
  var blockquote = Talker.getLastRow().find('blockquote');

  if (lastInsertion && lastInsertion.user.name == talkerEvent.user.name &&
                       lastInsertion.type == 'message' &&
                       !talkerEvent.private &&
                       !lastInsertion.private &&
                       blockquote[0]) {

    blockquote = blockquote.append(eventToLine(talkerEvent));

  } else {
    var escapedName = h(talkerEvent.user.name);
    $('<tr author="' + escapedName + '" class="message event user_' + talkerEvent.user.id
        + (talkerEvent.user.id == Talker.currentUser.id ? ' me' : ' ')
        + (talkerEvent.private ? ' private' : '')
        + '">'
        + '<td class="author" title="' + escapedName + '">'
        +   truncate(escapedName, 8)
        +   ' <img src="' + avatarUrl(talkerEvent.user) + '" alt="' + escapedName + '" class="avatar" />'
        +   '<b class="blockquote_tail"><!-- display fix --></b>'
        + '</td>'
        + '<td class="message">'
        +   '<blockquote>' + eventToLine(talkerEvent) + '</blockquote>'
        + '</td>'
      + '</tr>').appendTo('#log');
  }

  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('MessageInsertion', talkerEvent);
}

Talker.insertNotice = function(talkerEvent, content) {
  if (content) talkerEvent.content = content;

  talkerEvent.content = h(talkerEvent.content);

  $('<tr author="' + h(talkerEvent.user.name) + '" class="notice event user_' + talkerEvent.user.id + '">'
    + '<td class="author"></td>'
    + '<td class="message">' + eventToLine(talkerEvent) + '</td></tr>')
    .appendTo('#log');

  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('NoticeInsertion', talkerEvent);
}

function eventToLine(talkerEvent) {
  if (talkerEvent.id == 'pending'){
    return  '<div id="event_pending_' + (Talker.sentCount++) + '" class="line" pending="true" time="' + talkerEvent.time + '">'
          +   (Talker.isPaste(talkerEvent) ? '<img src="/images/loader.gif" height="11" width="16" alt="loading..." />' : talkerEvent.content)
          + '</div>';
  } else {
    return '<div id="event_' + talkerEvent.id + '" class="line" time="' + talkerEvent.time + '">' + talkerEvent.content + '</div>';
  }
}

Talker.getMessageBox = function() {
  return $('#msgbox');
}

Talker.lastInsertionEvent = Talker.dummyInsertionEvent = {user: {name:null}, type: null, private: false}; // start with a dummy

Talker.getLastRow = function() {
  return $('#log tr:last');
}

Talker.getLastAuthor = function() {
  return Talker.getLastRow().attr('author');
}

Talker.getLastInsertion = function() {
  return $('#log div[class=line]:last');
}

Talker.getLastPending = function() {
  return $("#log div[pending='true'].line");
}

Talker.getMaxContentWidth = function() {
  return $('#chat_log').width() - $('#log tr td:first').width() - 25;
}

Talker.notify = function(talkerEvent, content) {
  if (window.notifications && window.notifications.notifications_support()) {
    window.notifications.notify({
      title: Talker.getRoomName(),
      description: h(talkerEvent.user.name) + ": " + (content || talkerEvent.content)
    });
  }
}

Talker.error = function(error, culprit){
  if (console.error){
    alert('An error occured.  Check your Javascript console for details.')
    console.error(error);
    console.error(culprit + " seems to be the cause of the problem");
  } else {
    alert(error + (culprit || ''));
  }
}

Talker.getCommands = function() {
  return _.pluck(
    _.select(Talker.plugins, function(plugin) { return plugin.command }),
    'command'
  ).sort();
}

Talker.getCommandsAndUsage = function(){
  return  _.select(Talker.plugins, function(plugin) { return plugin.command }).map(function(command) {
    return [command.command, command.usage]
  }).sort();
}

Talker.getCurrentUser = function() {
  return Talker.currentUser;
}

Talker.getRoom = function() {
  return Talker.room;
}

Talker.getRoomName = function() {
  return Talker.getRoom().name;
}

Talker.getRoomUsers = function() {
  return Talker.users;
}

Talker.getRoomUsernames = function() {
  return _.map(Talker.getRoomUsers(), function(user) {
    return user.name;
  })
}

Talker.isPaste = function(talkerEvent) {
  return (typeof talkerEvent.content == 'string' && talkerEvent.content.match(/\n/gim) || (talkerEvent.paste != null && talkerEvent.paste != false)) ? true : false;
}

$(function() {

  $("div.flash").click(function() {
    $(this).remove();
    return false;
  });

  if ($("#invitees")[0]) {
    window.setTimeout(function(){ $('#invitees').focus(); }, 10);
  }

  if ($.cookie("browser_warn") != 1 && ($.browser.msie && $.browser.version[0] < 7) || $.browser.opera) {
    $.cookie("browser_warn", 1);
    $.facebox("<h3>Talker is not supported in this browser.</h3>"+
              "<p>It's possible (and probable) that you'll experience various issues using Talker with this browser.</p>"+
              "<p>Please report any problem to our <a href='http://talker.tenderapp.com/'>support site</a>.</p>");
  }

});
/**
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ace2Editor.registry={nextId:1};function Ace2Editor(){var K="Ace2Editor";var F=Ace2Editor;var B={};var A={editor:B,id:(F.registry.nextId++)};
var D=false;var E=[];function C(R,Q){return function(){var T=this;var S=arguments;function U(){R.apply(T,S);
}if(Q){Q.apply(T,S);}if(D){U();}else{E.push(U);}};}function I(){for(var Q=0;Q<E.length;Q++){E[Q]();}E=[];
}F.registry[A.id]=A;B.importText=C(function(R,Q){A.ace_importText(R,Q);});B.importAText=C(function(R,S,Q){A.ace_importAText(R,S,Q);
});B.exportText=function(){if(!D){return"(awaiting init)\n";}return A.ace_exportText();};B.getFrame=function(){return A.frame||null;
};B.focus=C(function(){A.ace_focus();});B.adjustSize=C(function(){var R=A.frame.parentNode;var Q=R.clientHeight;
A.frame.style.height=(Q?Q+"px":R.style.height);A.ace_editorChangedSize();});B.setEditable=C(function(Q){A.ace_setEditable(Q);
});B.getFormattedCode=function(){return A.ace_getFormattedCode();};B.setOnKeyPress=C(function(Q){A.ace_setOnKeyPress(Q);
});B.setOnKeyDown=C(function(Q){A.ace_setOnKeyDown(Q);});B.setNotifyDirty=C(function(Q){A.ace_setNotifyDirty(Q);
});B.setProperty=C(function(Q,R){A.ace_setProperty(Q,R);});B.getDebugProperty=function(Q){return A.ace_getDebugProperty(Q);
};B.setBaseText=C(function(Q){A.ace_setBaseText(Q);});B.setBaseAttributedText=C(function(R,Q){A.ace_setBaseAttributedText(R,Q);
});B.applyChangesToBase=C(function(R,Q,S){A.ace_applyChangesToBase(R,Q,S);});B.prepareUserChangeset=function(){if(!D){return null;
}return A.ace_prepareUserChangeset();};B.applyPreparedChangesetToBase=C(function(){A.ace_applyPreparedChangesetToBase();
});B.setUserChangeNotificationCallback=C(function(Q){A.ace_setUserChangeNotificationCallback(Q);});B.setAuthorInfo=C(function(R,Q){A.ace_setAuthorInfo(R,Q);
});B.setAuthorSelectionRange=C(function(R,S,Q){A.ace_setAuthorSelectionRange(R,S,Q);});B.getUnhandledErrors=function(){if(!D){return[];
}return A.ace_getUnhandledErrors();};B.execCommand=C(function(R,Q){A.ace_execCommand(R,Q);});var H=function(Q){return'<link rel="stylesheet" type="text/css" href="'+Q+'"/>';
};var J=function(Q){return'\x3cscript type="text/javascript" src="'+Q+'">\x3c/script>';};var M=J;var N=H;
var L=function(Q){return'\'<link rel="stylesheet" type="text/css" href="'+Q+"\"/>'";};var G=function(Q){return'\'\\x3cscript type="text/javascript" src="'+Q+"\">\\x3c/script>'";
};var P=G;var O=L;B.destroy=C(function(){A.ace_dispose();A.frame.parentNode.removeChild(A.frame);delete F.registry[A.id];
A=null;});B.init=function(Q,S,R){B.importText(S);A.onEditorReady=function(){D=true;I();R();};(function(){var W='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
var T=["'"+W+"<html><head>'"];T.push(("('<style type=\"text/css\">'+'body{margin:0;white-space:nowrap;}#outerdocbody{background-color:#fff;}body.grayedout{background-color:#eee!important;}#innerdocbody{font-size:12px;font-family:monospace;line-height:16px;}body.doesWrap{white-space:normal;}#innerdocbody{padding-top:1px;padding-right:10px;padding-bottom:8px;padding-left:1px;overflow:hidden;background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);}#sidediv{font-size:11px;font-family:monospace;line-height:16px;padding-top:8px;padding-right:3px;position:absolute;width:20px;top:0;left:0;cursor:default;color:white;}#sidedivinner{text-align:right;}.sidedivdelayed{background-color:#eee;color:#888!important;border-right:1px solid #999;}.sidedivhidden{display:none;}#outerdocbody iframe{display:block;position:relative;left:32px;top:7px;border:0;width:1px;height:1px;}#outerdocbody .hotrect{border:1px solid #999;position:absolute;}body.mozilla,body.safari{display:table-cell;}body.doesWrap{display:block!important;}.safari div{padding-right:1px;}p{margin:0;}#linemetricsdiv{position:absolute;left:-1000px;top:-1000px;color:white;z-index:-1;font-size:12px;font-family:monospace;}#overlaysdiv{position:absolute;left:-1000px;top:-1000px;}.syntax .c{color:#bd3f00;font-style:italic;}.syntax .o{font-weight:bold;}.syntax .p{font-weight:bold;}.syntax .k{color:blue;}.syntax .kc{color:purple;}.syntax .mf{color:purple;}.syntax .mh{color:purple;}.syntax .mi{color:purple;}.syntax .sr{color:purple;}.syntax .s2{color:purple;}.syntax .s1{color:purple;}.syntax .sd{color:purple;}.syntax .cs{color:#0a3;font-weight:bold;font-style:italic;}.syntax .err{color:#c00;font-weight:bold;text-decoration:underline;}.syntax .nt{font-weight:bold;}.syntax .nc{color:#336;}.syntax .nf{color:#336;}.syntax .nd{color:#999;}.syntax .m{color:purple;}.syntax .nb{color:purple;}.syntax .cp{color:#bd3f00;}.syntax .flash{background-color:#adf!important;}.syntax .flashbad{background-color:#f55!important;}html{cursor:text;}span{cursor:auto;}a{cursor:pointer!important;}ul,ol,li{padding:0;margin:0;}ul{margin-left:1.5em;}ul ul{margin-left:0!important;}ul.list-bullet1{margin-left:1.5em;}ul.list-bullet2{margin-left:3em;}ul.list-bullet3{margin-left:4.5em;}ul.list-bullet4{margin-left:6em;}ul.list-bullet5{margin-left:7.5em;}ul.list-bullet6{margin-left:9em;}ul.list-bullet7{margin-left:10.5em;}ul.list-bullet8{margin-left:12em;}ul{list-style-type:disc;}ul.list-bullet1{list-style-type:disc;}ul.list-bullet2{list-style-type:circle;}ul.list-bullet3{list-style-type:square;}ul.list-bullet4{list-style-type:disc;}ul.list-bullet5{list-style-type:circle;}ul.list-bullet6{list-style-type:square;}ul.list-bullet7{list-style-type:disc;}ul.list-bullet8{list-style-type:circle;}'+'\\x3c/style>')"));
T.push(('(\'\\x3cscript type="text/javascript">//<!--\\n\'+\'function isNodeText(A){return(A.nodeType==3);}function object(B){var A=function(){};A.prototype=B;return new A();\\n}function extend(C,A){for(var B in A){C[B]=A[B];}return C;}function forEach(B,D){for(var A=0;A\\x3cB.length;\\nA++){var C=D(B[A],A);if(C){break;}}}function map(C,D){var B=[];for(var A=0;A\\x3cC.length;A++){if(D){B.push(D(C[A],A));\\n}else{B.push(C[A]);}}return B;}function filter(B,D){var C=[];for(var A=0;A\\x3cB.length;A++){if(D(B[A],A)){C.push(B[A]);\\n}}return C;}function isArray(A){return A&&typeof A==="object"&&!(A.propertyIsEnumerable("length"))&&typeof A.length==="number";\\n}var userAgent=navigator.userAgent.toLowerCase();var browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\\\\\\x2f: ]([\\\\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent),windows:/windows/.test(userAgent)};\\nfunction getAssoc(B,A){return B["_magicdom_"+A];}function setAssoc(C,A,B){C["_magicdom_"+A]=B;}function binarySearch(A,E){if(A\\x3c1){return 0;\\n}if(E(0)){return 0;}if(!E(A-1)){return A;}var D=0;var B=A-1;while((B-D)>1){var C=Math.floor((D+B)/2);\\nif(E(C)){B=C;}else{D=C;}}return B;}function binarySearchInfinite(C,B){var A=0;while(!B(A)){A+=C;}return binarySearch(A,B);\\n}function htmlPrettyEscape(A){return A.replace(/&/g,"&amp;").replace(/\\x3c/g,"&lt;").replace(/>/g,"&gt;").replace(/\\\\r?\\\\n/g,"\\\\\\\\n");\\n}function newSkipList(){var H=window.PROFILER;if(!H){H=function(){return{start:G,mark:G,literal:G,end:G,cancel:G};\\n};}function G(){}var B={key:null,levels:1,upPtrs:[null],downPtrs:[null],downSkips:[1],downSkipWidths:[0]};\\nvar E={key:null,levels:1,upPtrs:[null],downPtrs:[null],downSkips:[null],downSkipWidths:[null]};var A=0;\\nvar D=0;var I={};B.downPtrs[0]=E;E.upPtrs[0]=B;function J(Z){var W=B.levels;var T=W-1;var X=-1,b=0;var V=new Array(W);\\nvar Y=new Array(W);var a=new Array(W);V[T]=B;Y[T]=-1;a[T]=0;while(T>=0){var U=V[T];while(U.downPtrs[T]&&(X+U.downSkips[T]\\x3cZ)){X+=U.downSkips[T];\\nb+=U.downSkipWidths[T];U=U.downPtrs[T];}V[T]=U;Y[T]=X;a[T]=b;T--;if(T>=0){V[T]=U;}}return{nodes:V,idxs:Y,loc:Z,widthSkips:a,toString:function(){return"getPoint("+Z+")";\\n}};}function P(W){var V=0;var T=B;var U=B.levels-1;while(U>=0&&T.downPtrs[U]){while(T.downPtrs[U]&&(V+T.downSkipWidths[U]\\x3c=W)){V+=T.downSkipWidths[U];\\nT=T.downPtrs[U];}U--;}if(T===B){return(B.downPtrs[0]||null);}else{if(T===E){return(W==D?(E.upPtrs[0]||null):null);\\n}}return T;}function K(T){return(T&&T.width)||0;}function N(V,f,h){var X=H("insertKey",false);var W={key:f,levels:0,upPtrs:[],downPtrs:[],downSkips:[],downSkipWidths:[]};\\nX.mark("donealloc");var Y=V.nodes;var e=V.idxs;var k=V.loc;var j=V.widthSkips[0]+V.nodes[0].downSkipWidths[0];\\nvar a=K(h);X.mark("loop1");while(W.levels==0||Math.random()\\x3c0.01){var T=W.levels;W.levels++;if(T==Y.length){Y[T]=B;\\ne[T]=-1;B.levels++;E.levels++;B.downPtrs[T]=E;E.upPtrs[T]=B;B.downSkips[T]=A+1;B.downSkipWidths[T]=D;\\nV.widthSkips[T]=0;}var Z=W;var U=Y[T];var d=U.downPtrs[T];var b=k-e[T];var g=U.downSkips[T]+1-b;U.downSkips[T]=b;\\nU.downPtrs[T]=Z;Z.downSkips[T]=g;Z.upPtrs[T]=U;Z.downPtrs[T]=d;d.upPtrs[T]=Z;var c=j-V.widthSkips[T];\\nvar i=U.downSkipWidths[T]+a-c;U.downSkipWidths[T]=c;Z.downSkipWidths[T]=i;}X.mark("loop2");X.literal(Y.length,"PNL");\\nfor(var T=W.levels;T\\x3cY.length;T++){var U=Y[T];U.downSkips[T]++;U.downSkipWidths[T]+=a;}X.mark("map");\\nI["$KEY$"+f]=W;A++;D+=a;X.end();}function O(T){return T.nodes[0].downPtrs[0];}function S(U){U.loc++;for(var T=0;\\nT\\x3cU.nodes.length;T++){if(U.idxs[T]+U.nodes[T].downSkips[T]\\x3cU.loc){U.idxs[T]+=U.nodes[T].downSkips[T];\\nU.widthSkips[T]+=U.nodes[T].downSkipWidths[T];U.nodes[T]=U.nodes[T].downPtrs[T];}}}function M(W){var V=W.nodes[0].downPtrs[0];\\nvar X=K(V.entry);for(var T=0;T\\x3cW.nodes.length;T++){if(T\\x3cV.levels){var U=V.upPtrs[T];var Y=V.downPtrs[T];\\nvar a=U.downSkips[T]+V.downSkips[T]-1;U.downPtrs[T]=Y;Y.upPtrs[T]=U;U.downSkips[T]=a;var Z=U.downSkipWidths[T]+V.downSkipWidths[T]-X;\\nU.downSkipWidths[T]=Z;}else{var U=W.nodes[T];var Y=U.downPtrs[T];U.downSkips[T]--;U.downSkipWidths[T]-=X;\\n}}delete I["$KEY$"+V.key];A--;D-=X;}function R(V){var X=V.downSkipWidths[0];var Y=K(V.entry);var W=Y-X;\\nvar U=V;var T=0;while(T\\x3cU.levels){U.downSkipWidths[T]+=W;T++;while(T>=U.levels&&U.upPtrs[T-1]){U=U.upPtrs[T-1];\\n}}D+=W;}function L(X,W){var V=(W?0:-1);var T=X;while(T!==B){var U=T.levels-1;T=T.upPtrs[U];if(W){V+=T.downSkipWidths[U];\\n}else{V+=T.downSkips[U];}}return V;}function F(T){return I["$KEY$"+T];}function Q(Y){var U=B;var T=B.levels-1;\\nvar W=-1;function X(Z){if(Z===B){return false;}else{if(Z===E){return true;}else{return Y(Z.entry);}}}while(T>=0){var V=U.downPtrs[T];\\nwhile(!X(V)){W+=U.downSkips[T];U=V;V=U.downPtrs[T];}T--;}return W+1;}var C={length:function(){return A;\\n},atIndex:function(T){if(T\\x3c0){console.warn("atIndex("+T+")");}if(T>=A){console.warn("atIndex("+T+">="+A+")");\\n}return O(J(T)).entry;},splice:function(T,W,V){if(T\\x3c0){console.warn("splice("+T+", ...)");}if(T+W>A){console.warn("splice("+T+", "+W+", ...), N="+A);\\nconsole.warn("%s %s %s",typeof T,typeof W,typeof A);console.trace();}if(!V){V=[];}var Y=J(T);for(var U=0;\\nU\\x3cW;U++){M(Y);}for(var U=(V.length-1);U>=0;U--){var X=V[U];N(Y,X.key,X);var Z=F(X.key);Z.entry=X;}},next:function(T){return F(T.key).downPtrs[0].entry||null;\\n},prev:function(T){return F(T.key).upPtrs[0].entry||null;},push:function(T){C.splice(A,0,[T]);},slice:function(T,U){if(T===undefined){T=0;\\n}else{if(T\\x3c0){T+=A;}}if(U===undefined){U=A;}else{if(U\\x3c0){U+=A;}}if(T\\x3c0){T=0;}if(T>A){T=A;}if(U\\x3c0){U=0;\\n}if(U>A){U=A;}dmesg(String([T,U,A]));if(U\\x3c=T){return[];}var V=C.atIndex(T);var X=[V];for(var W=1;W\\x3c(U-T);\\nW++){V=C.next(V);X.push(V);}return X;},atKey:function(T){return F(T).entry;},indexOfKey:function(T){return L(F(T));\\n},indexOfEntry:function(T){return C.indexOfKey(T.key);},containsKey:function(T){return !!(F(T));},atOffset:function(T){return P(T).entry;\\n},keyAtOffset:function(T){return C.atOffset(T).key;},offsetOfKey:function(T){return L(F(T),true);},offsetOfEntry:function(T){return C.offsetOfKey(T.key);\\n},setEntryWidth:function(T,U){T.width=U;R(F(T.key));},totalWidth:function(){return D;},offsetOfIndex:function(T){if(T\\x3c0){return 0;\\n}if(T>=A){return D;}return C.offsetOfEntry(C.atIndex(T));},indexOfOffset:function(T){if(T\\x3c=0){return 0;\\n}if(T>=D){return A;}return C.indexOfEntry(C.atOffset(T));},search:function(T){return Q(T);},debugGetPoint:J,debugDepth:function(){return B.levels;\\n}};return C;}function makeVirtualLineView(B){var E=20;var D=null;function G(){return B.textContent.length;\\n}function F(){if(!D){var J=C();J.forwardByWhile(E);D=J;}return D.getVirtualLine()+1;}function H(L){var J=C();\\nJ.forwardByWhile(E,null,L);var K=J.getVirtualLine();J.backwardByWhile(8,function(){return J.getVirtualLine()==K;\\n});J.forwardByWhile(1,function(){return J.getVirtualLine()!=K;});var M=J.getOffset();return{vline:K,offset:(L-M)};\\n}function I(Q,P){var J=C();J.binarySearch(function(){return J.getVirtualLine()>=Q;});var M=J.getOffset();\\nvar L=J.getVirtualLine();J.forwardByWhile(E,null,M+P);J.backwardByWhile(1,function(){return J.getVirtualLine()!=L;\\n},M);var K=J.getOffset();var N=K-M;if(N\\x3cP&&L==(F()-1)){var O=G();N+=O-K;K=O;}return{vline:L,offset:N,lineChar:K};\\n}return{getNumVirtualLines:F,getVLineAndOffsetForChar:H,getCharForVLineAndOffset:I,makeCharSeeker:function(){return C();\\n}};function A(J){J=J.firstChild;while(J&&J.firstChild){J=J.firstChild;}if(J.data){return J;}return null;\\n}function C(){function T(a,b){var Z=a.parentNode;var f=(a.nodeValue.charAt(b)===" ");if(f){if(b==0){if(Z.previousSibling&&A(Z.previousSibling)){a=A(Z.previousSibling);\\nb=a.length-1;Z=a.parentNode;}else{return{top:Z.offsetTop,left:Z.offsetLeft};}}else{b--;}}var c=document.createElement("SPAN");\\nvar e=a.nodeValue;var d=document.createDocumentFragment();d.appendChild(document.createTextNode(e.substring(0,b)));\\nc.appendChild(document.createTextNode(e.substr(b,1)));d.appendChild(c);d.appendChild(document.createTextNode(e.substring(b+1)));\\nZ.replaceChild(d,a);var g={top:c.offsetTop,left:c.offsetLeft+(f?c.offsetWidth:0),height:c.offsetHeight};\\nwhile(Z.firstChild){Z.removeChild(Z.firstChild);}Z.appendChild(a);return g;}var Y=B.textContent;var O=Y.length;\\nvar M=null;var J=0;var L=0;var P;var N;var V;var X=0;function Q(){var Z=M;if(!Z){Z=B.firstChild;}else{Z=Z.nextSibling;\\n}while(Z&&!A(Z)){Z=Z.nextSibling;}return Z;}function S(){var Z=M;if(!Z){Z=B.lastChild;}else{Z=Z.previousSibling;\\n}while(Z&&!A(Z)){Z=Z.previousSibling;}return Z;}var K;if(O>0){M=Q();var R=T(A(M),0);V=R.height;P=R.top;\\nN=R.left;function W(b,a){var Z=T(b,a);X+=Math.round((Z.top-P)/V);P=Z.top;N=Z.left;}K={forward:function(e){var c=J;\\nvar Z=J+e;if(Z>(O-1)){Z=O-1;}while(J\\x3cZ){var d=A(M).length;var a=d-L;if(J+a>Z||!Q()){var b=Z-J;if(b>=a){b=a-1;\\n}J+=b;L+=b;break;}else{J+=a;L=0;M=Q();}}W(A(M),L);return J-c;},backward:function(c){var b=J;var Z=J-c;\\nif(Z\\x3c0){Z=0;}while(J>Z){if(J-L\\x3c=Z||!S()){var a=J-Z;if(a>L){a=L;}J-=a;L-=a;break;}else{J-=L+1;M=S();L=A(M).length-1;\\n}}W(A(M),L);return b-J;},getVirtualLine:function(){return X;},getLeftCoord:function(){return N;}};}else{N=B.offsetLeft;\\nK={forward:function(Z){return 0;},backward:function(Z){return 0;},getVirtualLine:function(){return 0;\\n},getLeftCoord:function(){return N;}};}K.getOffset=function(){return J;};K.getLineLength=function(){return O;\\n};K.toString=function(){return"seeker[curChar: "+J+"("+Y.charAt(J)+"), left: "+K.getLeftCoord()+", vline: "+K.getVirtualLine()+"]";\\n};function U(c,j,e,a){var b=null;var i=((typeof e)=="function");var h=e;var g=((typeof a)=="number");\\nvar d=a;while(b!==0&&((!i)||h())){var Z=j;if(g){var f=(c?J-d:d-J);if(f\\x3cZ){Z=f;}}if(Z\\x3c0){break;}b=(c?K.backward(Z):K.forward(Z));\\n}}K.forwardByWhile=function(Z,b,a){U(false,Z,b,a);};K.backwardByWhile=function(Z,b,a){U(true,Z,b,a);};\\nK.binarySearch=function(Z){var b=Z;var a=function(){return !Z();};K.forwardByWhile(20,a);K.backwardByWhile(20,b);\\nK.forwardByWhile(10,a);K.backwardByWhile(5,b);K.forwardByWhile(1,a);return K.getOffset()+(Z()?0:1);};\\nreturn K;}}var _opt=null;function AttribPool(){var A={};A.numToAttrib={};A.attribToNum={};A.nextNum=0;\\nA.putAttrib=function(C,E){var D=String(C);if(D in A.attribToNum){return A.attribToNum[D];}if(E){return -1;\\n}var B=A.nextNum++;A.attribToNum[D]=B;A.numToAttrib[B]=[String(C[0]||""),String(C[1]||"")];return B;};\\nA.getAttrib=function(C){var B=A.numToAttrib[C];if(!B){return B;}return[B[0],B[1]];};A.getAttribKey=function(C){var B=A.numToAttrib[C];\\nif(!B){return"";}return B[0];};A.getAttribValue=function(C){var B=A.numToAttrib[C];if(!B){return"";}return B[1];\\n};A.eachAttrib=function(C){for(var D in A.numToAttrib){var B=A.numToAttrib[D];C(B[0],B[1]);}};A.toJsonable=function(){return{numToAttrib:A.numToAttrib,nextNum:A.nextNum};\\n};A.fromJsonable=function(B){A.numToAttrib=B.numToAttrib;A.nextNum=B.nextNum;A.attribToNum={};for(var C in A.numToAttrib){A.attribToNum[String(A.numToAttrib[C])]=Number(C);\\n}return A;};return A;}var Changeset={};Changeset.error=function error(B){var A=new Error(B);A.easysync=true;\\nthrow A;};Changeset.assert=function assert(A,C){if(!A){var B=Array.prototype.slice.call(arguments,1).join("");\\nChangeset.error("Changeset: "+B);}};Changeset.parseNum=function(A){return parseInt(A,36);};Changeset.numToString=function(A){return A.toString(36).toLowerCase();\\n};Changeset.toBaseTen=function(A){var B=A.indexOf("$");var D=A.substring(0,B);var C=A.substring(B);return D.replace(/[0-9a-z]+/g,function(E){return String(Changeset.parseNum(E));\\n})+C;};Changeset.oldLen=function(A){return Changeset.unpack(A).oldLen;};Changeset.newLen=function(A){return Changeset.unpack(A).newLen;\\n};Changeset.opIterator=function(E,K){var D=/((?:\\\\*[0-9a-z]+)*)(?:\\\\|([0-9a-z]+))?([-+=])([0-9a-z]+)|\\\\?|/g;\\nvar L=(K||0);var B=L;var F=B;function C(){F=B;var M;if(_opt){M=_opt.nextOpInString(E,B);if(M){if(M.opcode()=="?"){Changeset.error("Hit error opcode in op stream");\\n}B=M.lastIndex();}}else{D.lastIndex=B;M=D.exec(E);B=D.lastIndex;if(M[0]=="?"){Changeset.error("Hit error opcode in op stream");\\n}}return M;}var A=C();var H=Changeset.newOp();function I(N){var M=(N||H);if(_opt&&A){M.attribs=A.attribs();\\nM.lines=A.lines();M.chars=A.chars();M.opcode=A.opcode();A=C();}else{if((!_opt)&&A[0]){M.attribs=A[1];\\nM.lines=Changeset.parseNum(A[2]||0);M.opcode=A[3];M.chars=Changeset.parseNum(A[4]);A=C();}else{Changeset.clearOp(M);\\n}}return M;}function G(){return !!(_opt?A:A[0]);}function J(){return F;}return{next:I,hasNext:G,lastIndex:J};\\n};Changeset.clearOp=function(A){A.opcode="";A.chars=0;A.lines=0;A.attribs="";};Changeset.newOp=function(A){return{opcode:(A||""),chars:0,lines:0,attribs:""};\\n};Changeset.cloneOp=function(A){return{opcode:A.opcode,chars:A.chars,lines:A.lines,attribs:A.attribs};\\n};Changeset.copyOp=function(B,A){A.opcode=B.opcode;A.chars=B.chars;A.lines=B.lines;A.attribs=B.attribs;\\n};Changeset.opString=function(B){if(!B.opcode){return"null";}var A=Changeset.opAssembler();A.append(B);\\nreturn A.toString();};Changeset.stringOp=function(A){return Changeset.opIterator(A).next();};Changeset.checkRep=function(C){var G=Changeset.unpack(C);\\nvar F=G.oldLen;var J=G.newLen;var M=G.ops;var E=G.charBank;var I=Changeset.smartOpAssembler();var D=0;\\nvar B=0;var H=0;var K=Changeset.opIterator(M);while(K.hasNext()){var A=K.next();switch(A.opcode){case"=":D+=A.chars;\\nB+=A.chars;break;case"-":D+=A.chars;Changeset.assert(D\\x3cF,D," >= ",F," in ",C);break;case"+":B+=A.chars;\\nH+=A.chars;Changeset.assert(B\\x3cJ,B," >= ",J," in ",C);break;}I.append(A);}B+=F-D;E=E.substring(0,H);while(E.length\\x3cH){E+="?";\\n}I.endDocument();var L=Changeset.pack(F,B,I.toString(),E);Changeset.assert(L==C,L," != ",C);return C;\\n};Changeset.smartOpAssembler=function(){var G=Changeset.mergingOpAssembler();var E=Changeset.mergingOpAssembler();\\nvar B=Changeset.mergingOpAssembler();var A=Changeset.stringAssembler();var C="";var F=0;function H(){A.append(B.toString());\\nB.clear();}function I(){A.append(G.toString());G.clear();A.append(E.toString());E.clear();}function D(O){if(!O.opcode){return;\\n}if(!O.chars){return;}if(O.opcode=="-"){if(C=="="){H();}G.append(O);F-=O.chars;}else{if(O.opcode=="+"){if(C=="="){H();\\n}E.append(O);F+=O.chars;}else{if(O.opcode=="="){if(C!="="){I();}B.append(O);}}}C=O.opcode;}function M(R,P,T,S){var O=Changeset.newOp(R);\\nO.attribs=Changeset.makeAttribsString(R,T,S);var Q=P.lastIndexOf("\\\\n");if(Q\\x3c0){O.chars=P.length;O.lines=0;\\nD(O);}else{O.chars=Q+1;O.lines=P.match(/\\\\n/g).length;D(O);O.chars=P.length-(Q+1);O.lines=0;D(O);}}function K(){I();\\nH();return A.toString();}function N(){G.clear();E.clear();B.clear();A.clear();F=0;}function L(){B.endDocument();\\n}function J(){return F;}return{append:D,toString:K,clear:N,endDocument:L,appendOpWithText:M,getLengthChange:J};\\n};if(_opt){Changeset.mergingOpAssembler=function(){var A=_opt.mergingOpAssembler();function C(F){A.append(F.opcode,F.chars,F.lines,F.attribs);\\n}function E(){return A.toString();}function B(){A.clear();}function D(){A.endDocument();}return{append:C,toString:E,clear:B,endDocument:D};\\n};}else{Changeset.mergingOpAssembler=function(){var C=Changeset.opAssembler();var A=Changeset.newOp();\\nvar B=0;function D(I){if(A.opcode){if(I&&A.opcode=="="&&!A.attribs){}else{C.append(A);if(B){A.chars=B;\\nA.lines=0;C.append(A);B=0;}}A.opcode="";}}function F(I){if(I.chars>0){if(A.opcode==I.opcode&&A.attribs==I.attribs){if(I.lines>0){A.chars+=B+I.chars;\\nA.lines+=I.lines;B=0;}else{if(A.lines==0){A.chars+=I.chars;}else{B+=I.chars;}}}else{D();Changeset.copyOp(I,A);\\n}}}function G(){D(true);}function H(){D();return C.toString();}function E(){C.clear();Changeset.clearOp(A);\\n}return{append:F,toString:H,clear:E,endDocument:G};};}if(_opt){Changeset.opAssembler=function(){var A=_opt.opAssembler();\\nfunction C(E){A.append(E.opcode,E.chars,E.lines,E.attribs);}function D(){return A.toString();}function B(){A.clear();\\n}return{append:C,toString:D,clear:B};};}else{Changeset.opAssembler=function(){var A=[];function C(E){A.push(E.attribs);\\nif(E.lines){A.push("|",Changeset.numToString(E.lines));}A.push(E.opcode);A.push(Changeset.numToString(E.chars));\\n}function D(){return A.join("");}function B(){A.length=0;}return{append:C,toString:D,clear:B};};}Changeset.stringIterator=function(D){var A=0;\\nfunction B(H){Changeset.assert(H\\x3c=C(),"!(",H," \\x3c= ",C(),")");}function F(H){B(H);var I=D.substr(A,H);\\nA+=H;return I;}function E(H){B(H);var I=D.substr(A,H);return I;}function G(H){B(H);A+=H;}function C(){return D.length-A;\\n}return{take:F,skip:G,remaining:C,peek:E};};Changeset.stringAssembler=function(){var A=[];function B(D){A.push(String(D));\\n}function C(){return A.join("");}return{append:B,toString:C};};Changeset.textLinesMutator=function(C){var A=[0,0];\\nvar D=false;var E=0,B=0;function O(X){C.splice.apply(C,X);}function S(){return C.toSource();}function J(X){if(C.get){return C.get(X);\\n}else{return C[X];}}function U(Y,X){if(C.slice){return C.slice(Y,X);}else{return[];}}function T(){if((typeof C.length)=="number"){return C.length;\\n}else{return C.length();}}function G(){A[0]=E;A[1]=0;if(B>0){F();}D=true;}function K(){O(A);A.length=2;\\nA[0]=A[1]=0;D=false;}function H(){return(E-A[0]\\x3c(A.length-2));}function W(X){print(X+": "+A.toSource()+" / "+E+","+B+" / "+S());\\n}function F(){if(!H()){A.push(J(A[0]+A[1]));A[1]++;}return 2+E-A[0];}function L(X,Z){if(X){if(Z){if(!D){G();\\n}for(var Y=0;Y\\x3cX;Y++){B=0;F();E++;}}else{if(D){if(X>1){K();}else{F();}}E+=X;B=0;}}}function R(Z,Y,X){if(Z){if(Y){L(Y,X);\\n}else{if(X&&!D){G();}if(D){F();}B+=Z;}}}function I(X){var Y="";if(X){if(!D){G();}function a(c){var b=A[0]+A[1];\\nreturn U(b,b+c).join("");}if(H()){if(B==0){Y=A[A.length-1];A.length--;Y+=a(X-1);A[1]+=X-1;}else{Y=a(X-1);\\nA[1]+=X-1;var Z=A.length-1;Y=A[Z].substring(B)+Y;A[Z]=A[Z].substring(0,B)+J(A[0]+A[1]);A[1]+=1;}}else{Y=a(X);\\nA[1]+=X;}}return Y;}function V(Y,Z){var a="";if(Y){if(Z){return I(Z);}else{if(!D){G();}var X=F();a=A[X].substring(B,B+Y);\\nA[X]=A[X].substring(0,B)+A[X].substring(B+Y);}}return a;}function M(Z,c){if(Z){if(!D){G();}if(c){var X=Changeset.splitTextLines(Z);\\nif(H()){var Y=A.length-1;var a=A[Y];var b=B;A[Y]=a.substring(0,b)+X[0];E++;X.splice(0,1);Array.prototype.push.apply(A,X);\\nE+=X.length;A.push(a.substring(b));B=0;}else{Array.prototype.push.apply(A,X);E+=X.length;}}else{var Y=F();\\nA[Y]=A[Y].substring(0,B)+Z+A[Y].substring(B);B+=Z.length;}}}function N(){var X=T();if(D){X+=A.length-2-A[1];\\n}return E\\x3cX;}function P(){if(D){K();}}var Q={skip:R,remove:V,insert:M,close:P,hasMore:N,removeLines:I,skipLines:L};\\nreturn Q;};Changeset.applyZip=function(I,K,H,J,G){var F=Changeset.opIterator(I,K);var E=Changeset.opIterator(H,J);\\nvar D=Changeset.smartOpAssembler();var A=Changeset.newOp();var C=Changeset.newOp();var B=Changeset.newOp();\\nwhile(A.opcode||F.hasNext()||C.opcode||E.hasNext()){if((!A.opcode)&&F.hasNext()){F.next(A);}if((!C.opcode)&&E.hasNext()){E.next(C);\\n}G(A,C,B);if(B.opcode){D.append(B);B.opcode="";}}D.endDocument();return D.toString();};Changeset.unpack=function(B){var G=/Z:([0-9a-z]+)([>\\x3c])([0-9a-z]+)|/;\\nvar A=G.exec(B);if((!A)||(!A[0])){Changeset.error("Not a changeset: "+B);}var D=Changeset.parseNum(A[1]);\\nvar E=(A[2]==">")?1:-1;var H=Changeset.parseNum(A[3]);var F=D+E*H;var I=A[0].length;var C=B.indexOf("$");\\nif(C\\x3c0){C=B.length;}return{oldLen:D,newLen:F,ops:B.substring(I,C),charBank:B.substring(C+1)};};Changeset.pack=function(C,G,F,D){var A=G-C;\\nvar E=(A>=0?">"+Changeset.numToString(A):"\\x3c"+Changeset.numToString(-A));var B=[];B.push("Z:",Changeset.numToString(C),E,F,"$",D);\\nreturn B.join("");};Changeset.applyToText=function(H,E){var C=Changeset.unpack(H);Changeset.assert(E.length==C.oldLen,"mismatched apply: ",E.length," / ",C.oldLen);\\nvar F=Changeset.opIterator(C.ops);var G=Changeset.stringIterator(C.charBank);var B=Changeset.stringIterator(E);\\nvar A=Changeset.stringAssembler();while(F.hasNext()){var D=F.next();switch(D.opcode){case"+":A.append(G.take(D.chars));\\nbreak;case"-":B.skip(D.chars);break;case"=":A.append(B.take(D.chars));break;}}A.append(B.take(B.remaining()));\\nreturn A.toString();};Changeset.mutateTextLines=function(G,F){var C=Changeset.unpack(G);var D=Changeset.opIterator(C.ops);\\nvar E=Changeset.stringIterator(C.charBank);var B=Changeset.textLinesMutator(F);while(D.hasNext()){var A=D.next();\\nswitch(A.opcode){case"+":B.insert(E.take(A.chars),A.lines);break;case"-":B.remove(A.chars,A.lines);break;\\ncase"=":B.skip(A.chars,A.lines,(!!A.attribs));break;}}B.close();};Changeset.composeAttributes=function(G,F,E,D){if((!G)&&E){return F;\\n}if(!F){return G;}var A=[];G.replace(/\\\\*([0-9a-z]+)/g,function(I,H){A.push(D.getAttrib(Changeset.parseNum(H)));\\nreturn"";});F.replace(/\\\\*([0-9a-z]+)/g,function(M,L){var H=D.getAttrib(Changeset.parseNum(L));var K=false;\\nfor(var I=0;I\\x3cA.length;I++){var J=A[I];if(J[0]==H[0]){if(H[1]||E){J[1]=H[1];}else{A.splice(I,1);}K=true;\\nbreak;}}if((!K)&&(H[1]||E)){A.push(H);}return"";});A.sort();var B=Changeset.stringAssembler();for(var C=0;\\nC\\x3cA.length;C++){B.append("*");B.append(Changeset.numToString(D.putAttrib(A[C])));}return B.toString();\\n};Changeset._slicerZipperFunc=function(A,B,C,D){if(A.opcode=="-"){Changeset.copyOp(A,C);A.opcode="";}else{if(!A.opcode){Changeset.copyOp(B,C);\\nB.opcode="";}else{switch(B.opcode){case"-":if(B.chars\\x3c=A.chars){if(A.opcode=="="){C.opcode="-";C.chars=B.chars;\\nC.lines=B.lines;C.attribs="";}A.chars-=B.chars;A.lines-=B.lines;B.opcode="";if(!A.chars){A.opcode="";\\n}}else{if(A.opcode=="="){C.opcode="-";C.chars=A.chars;C.lines=A.lines;C.attribs="";}B.chars-=A.chars;\\nB.lines-=A.lines;A.opcode="";}break;case"+":Changeset.copyOp(B,C);B.opcode="";break;case"=":if(B.chars\\x3c=A.chars){C.opcode=A.opcode;\\nC.chars=B.chars;C.lines=B.lines;C.attribs=Changeset.composeAttributes(A.attribs,B.attribs,A.opcode=="=",D);\\nB.opcode="";A.chars-=B.chars;A.lines-=B.lines;if(!A.chars){A.opcode="";}}else{C.opcode=A.opcode;C.chars=A.chars;\\nC.lines=A.lines;C.attribs=Changeset.composeAttributes(A.attribs,B.attribs,A.opcode=="=",D);A.opcode="";\\nB.chars-=A.chars;B.lines-=A.lines;}break;case"":Changeset.copyOp(A,C);A.opcode="";break;}}}};Changeset.applyToAttribution=function(D,C,B){var A=Changeset.unpack(D);\\nreturn Changeset.applyZip(C,0,A.ops,0,function(F,E,G){return Changeset._slicerZipperFunc(F,E,G,B);});\\n};Changeset.mutateAttributionLines=function(N,Q,O){var I=Changeset.unpack(N);var H=Changeset.opIterator(I.ops);\\nvar M=I.charBank;var G=0;var F=Changeset.textLinesMutator(Q);var B=null;function L(){return(B&&B.hasNext())||F.hasMore();\\n}function P(R){if((!(B&&B.hasNext()))&&F.hasMore()){var S=F.removeLines(1);B=Changeset.opIterator(S);\\n}if(B&&B.hasNext()){B.next(R);}else{R.opcode="";}}var D=null;function J(R){if(!D){D=Changeset.mergingOpAssembler();\\n}D.append(R);if(R.lines>0){Changeset.assert(R.lines==1,"Can\\\'t have op.lines of ",R.lines," in attribution lines");\\nF.insert(D.toString(),1);D=null;}}var A=Changeset.newOp();var E=Changeset.newOp();var C=Changeset.newOp();\\nwhile(A.opcode||H.hasNext()||E.opcode||L()){if((!A.opcode)&&H.hasNext()){H.next(A);}if((!A.opcode)&&(!E.opcode)&&(!D)&&(!(B&&B.hasNext()))){break;\\n}else{if(A.opcode=="="&&A.lines>0&&(!A.attribs)&&(!E.opcode)&&(!D)&&(!(B&&B.hasNext()))){F.skipLines(A.lines);\\nA.opcode="";}else{if(A.opcode=="+"){if(A.lines>1){var K=M.indexOf("\\\\n",G)+1-G;Changeset.copyOp(A,C);A.chars-=K;\\nA.lines--;C.lines=1;C.chars=K;}else{Changeset.copyOp(A,C);A.opcode="";}J(C);G+=C.chars;C.opcode="";}else{if((!E.opcode)&&L()){P(E);\\n}Changeset._slicerZipperFunc(E,A,C,O);if(C.opcode){J(C);C.opcode="";}}}}}Changeset.assert(!D,"line assembler not finished");\\nF.close();};Changeset.joinAttributionLines=function(D){var C=Changeset.mergingOpAssembler();for(var A=0;\\nA\\x3cD.length;A++){var E=D[A];var B=Changeset.opIterator(E);while(B.hasNext()){C.append(B.next());}}return C.toString();\\n};Changeset.splitAttributionLines=function(J,K){var G=Changeset.opIterator(J);var C=Changeset.mergingOpAssembler();\\nvar I=[];var D=0;function E(L){C.append(L);if(L.lines>0){I.push(C.toString());C.clear();}D+=L.chars;}while(G.hasNext()){var A=G.next();\\nvar F=A.chars;var B=A.lines;while(B>1){var H=K.indexOf("\\\\n",D)+1;Changeset.assert(H>0,"newlineEnd \\x3c= 0 in splitAttributionLines");\\nA.chars=H-D;A.lines=1;E(A);F-=A.chars;B-=A.lines;}if(B==1){A.chars=F;A.lines=1;}E(A);}return I;};Changeset.splitTextLines=function(A){return A.match(/[^\\\\n]*(?:\\\\n|[^\\\\n]$)/g);\\n};Changeset.compose=function(J,H,L){var B=Changeset.unpack(J);var A=Changeset.unpack(H);var K=B.oldLen;\\nvar I=B.newLen;Changeset.assert(I==A.oldLen,"mismatched composition");var G=A.newLen;var D=Changeset.stringIterator(B.charBank);\\nvar E=Changeset.stringIterator(A.charBank);var C=Changeset.stringAssembler();var F=Changeset.applyZip(B.ops,0,A.ops,0,function(O,N,M){var Q=O.opcode;\\nvar P=N.opcode;if(Q=="+"&&P=="-"){D.skip(Math.min(O.chars,N.chars));}Changeset._slicerZipperFunc(O,N,M,L);\\nif(M.opcode=="+"){if(P=="+"){C.append(E.take(M.chars));}else{C.append(D.take(M.chars));}}});return Changeset.pack(K,G,F,C.toString());\\n};Changeset.attributeTester=function(D,B){if(!B){return C;}var A=B.putAttrib(D,true);if(A\\x3c0){return C;\\n}else{var E=new RegExp("\\\\\\\\*"+Changeset.numToString(A)+"(?!\\\\\\\\w)");return function(F){return E.test(F);\\n};}function C(F){return false;}};Changeset.identity=function(A){return Changeset.pack(A,A,"","");};Changeset.makeSplice=function(B,A,F,E,H,J){var D=B.length;\\nif(A>=D){A=D-1;}if(F>B.length-A-1){F=B.length-A-1;}var G=B.substring(A,A+F);var I=D+E.length-G.length;\\nvar C=Changeset.smartOpAssembler();C.appendOpWithText("=",B.substring(0,A));C.appendOpWithText("-",G);\\nC.appendOpWithText("+",E,H,J);C.endDocument();return Changeset.pack(D,I,C.toString(),E);};Changeset.toSplices=function(G){var F=Changeset.unpack(G);\\nvar B=[];var C=0;var E=Changeset.opIterator(F.ops);var H=Changeset.stringIterator(F.charBank);var D=false;\\nwhile(E.hasNext()){var A=E.next();if(A.opcode=="="){C+=A.chars;D=false;}else{if(!D){B.push([C,C,""]);\\nD=true;}if(A.opcode=="-"){C+=A.chars;B[B.length-1][1]+=A.chars;}else{if(A.opcode=="+"){B[B.length-1][2]+=H.take(A.chars);\\n}}}}return B;};Changeset.characterRangeFollow=function(M,N,L,K){var C=N;var A=L;var J=Changeset.toSplices(M);\\nvar H=0;for(var G=0;G\\x3cJ.length;G++){var F=J[G];var B=F[0]+H;var E=F[1]+H;var I=F[2].length;var D=I-(E-B);\\nif(B\\x3c=C&&E>=A){if(K){C=A=B;}else{C=A=B+I;}}else{if(E\\x3c=C){C+=D;A+=D;}else{if(B>=A){}else{if(B>=C&&E\\x3c=A){A+=D;\\n}else{if(E\\x3cA){C=B+I;A+=D;}else{A=B;}}}}}H+=D;}return[C,A];};Changeset.moveOpsToNewPool=function(A,F,C){var B=A.indexOf("$");\\nif(B\\x3c0){B=A.length;}var D=A.substring(0,B);var E=A.substring(B);return D.replace(/\\\\*([0-9a-z]+)/g,function(K,G){var H=Changeset.parseNum(G);\\nvar J=F.getAttrib(H);var I=C.putAttrib(J);return"*"+Changeset.numToString(I);})+E;};Changeset.makeAttribution=function(B){var A=Changeset.smartOpAssembler();\\nA.appendOpWithText("+",B);return A.toString();};Changeset.eachAttribNumber=function(A,D){var B=A.indexOf("$");\\nif(B\\x3c0){B=A.length;}var C=A.substring(0,B);C.replace(/\\\\*([0-9a-z]+)/g,function(F,E){D(Changeset.parseNum(E));\\nreturn"";});};Changeset.filterAttribNumbers=function(B,A){return Changeset.mapAttribNumbers(B,A);};Changeset.mapAttribNumbers=function(A,E){var B=A.indexOf("$");\\nif(B\\x3c0){B=A.length;}var D=A.substring(0,B);var C=D.replace(/\\\\*([0-9a-z]+)/g,function(H,G){var F=E(Changeset.parseNum(G));\\nif(F===true){return H;}else{if((typeof F)==="number"){return"*"+Changeset.numToString(F);}else{return"";\\n}}});return C+A.substring(B);};Changeset.makeAText=function(A,B){return{text:A,attribs:(B||Changeset.makeAttribution(A))};\\n};Changeset.applyToAText=function(A,B,C){return{text:Changeset.applyToText(A,B.text),attribs:Changeset.applyToAttribution(A,B.attribs,C)};\\n};Changeset.cloneAText=function(A){return{text:A.text,attribs:A.attribs};};Changeset.copyAText=function(A,B){B.text=A.text;\\nB.attribs=A.attribs;};Changeset.appendATextToAssembler=function(C,B){var D=Changeset.opIterator(C.attribs);\\nvar A=Changeset.newOp();while(D.hasNext()){D.next(A);if(!D.hasNext()){if(A.lines\\x3c=1){A.lines=0;A.chars--;\\nif(A.chars){B.append(A);}}else{var F=C.text.lastIndexOf("\\\\n",C.text.length-2)+1;var E=C.text.length-F-1;\\nA.lines--;A.chars-=(E+1);B.append(A);A.lines=0;A.chars=E;if(A.chars){B.append(A);}}}else{B.append(A);\\n}}};Changeset.prepareForWire=function(C,B){var A=new AttribPool();var D=Changeset.moveOpsToNewPool(C,B,A);\\nreturn{translated:D,pool:A};};Changeset.isIdentity=function(B){var A=Changeset.unpack(B);return A.ops==""&&A.oldLen==A.newLen;\\n};Changeset.opAttributeValue=function(C,B,A){return Changeset.attribsAttributeValue(C.attribs,B,A);};\\nChangeset.attribsAttributeValue=function(C,D,A){var B="";if(C){Changeset.eachAttribNumber(C,function(E){if(A.getAttribKey(E)==D){B=A.getAttribValue(E);\\n}});}return B;};Changeset.builder=function(D){var B=Changeset.smartOpAssembler();var A=Changeset.newOp();\\nvar E=Changeset.stringAssembler();var C={keep:function(I,G,F,H){A.opcode="=";A.attribs=(F&&Changeset.makeAttribsString("=",F,H))||"";\\nA.chars=I;A.lines=(G||0);B.append(A);return C;},keepText:function(H,G,F){B.appendOpWithText("=",H,G,F);\\nreturn C;},insert:function(F,H,G){B.appendOpWithText("+",F,H,G);E.append(F);return C;},remove:function(G,F){A.opcode="-";\\nA.attribs="";A.chars=G;A.lines=(F||0);B.append(A);return C;},toString:function(){B.endDocument();var F=D+B.getLengthChange();\\nreturn Changeset.pack(D,F,B.toString(),E.toString());}};return C;};Changeset.makeAttribsString=function(E,A,D){if(!A){return"";\\n}else{if((typeof A)=="string"){return A;}else{if(D&&A&&A.length){if(A.length>1){A=A.slice();A.sort();\\n}var C=[];for(var B=0;B\\x3cA.length;B++){var F=A[B];if(E=="="||(E=="+"&&F[1])){C.push("*"+Changeset.numToString(D.putAttrib(F)));\\n}}return C.join("");}}}};Changeset.subattribution=function(I,F,H){var E=Changeset.opIterator(I,0);var D=Changeset.smartOpAssembler();\\nvar A=Changeset.newOp();var B=Changeset.newOp();var C=Changeset.newOp();function G(){if(B.chars){while(B.opcode&&(A.opcode||E.hasNext())){if(!A.opcode){E.next(A);\\n}if(B.opcode&&A.opcode&&B.chars>=A.chars&&A.lines>0&&B.lines\\x3c=0){B.lines++;}Changeset._slicerZipperFunc(A,B,C,null);\\nif(C.opcode){D.append(C);C.opcode="";}}}}B.opcode="-";B.chars=F;G();if(H===undefined){if(A.opcode){D.append(A);\\n}while(E.hasNext()){E.next(A);D.append(A);}}else{B.opcode="=";B.chars=H-F;G();}return D.toString();};\\nChangeset.inverse=function(U,F,G,J){function P(a){if(F.get){return F.get(a);}else{return F[a];}}function Z(){if((typeof F.length)=="number"){return F.length;\\n}else{return F.length();}}function Q(a){if(G.get){return G.get(a);}else{return G[a];}}function Y(){if((typeof G.length)=="number"){return G.length;\\n}else{return G.length();}}var C=0;var E=0;var D=null;var I;var A=Changeset.newOp("+");var R=Changeset.unpack(U);\\nvar N=Changeset.opIterator(R.ops);var H=Changeset.builder(R.newLen);function M(c,e){if((!D)||(I!=C)){D=Changeset.opIterator(Q(C));\\nI=C;var b=0;var d=false;while(!d){D.next(A);if(b+A.chars>=E){A.chars-=(E-b);d=true;}else{b+=A.chars;}}}while(c>0){if((!A.chars)&&(!D.hasNext())){C++;\\nE=0;I=C;A.chars=0;D=Changeset.opIterator(Q(C));}if(!A.chars){D.next(A);}var a=Math.min(c,A.chars);e(a,A.attribs,a==A.chars&&A.lines>0);\\nc-=a;A.chars-=a;E+=a;}if((!A.chars)&&(!D.hasNext())){C++;E=0;}}function X(b,a){if(a){C+=a;E=0;}else{if(D&&I==C){M(b,function(){});\\n}else{E+=b;}}}function S(e){var a=0;var b=Changeset.stringAssembler();var c=P(C).substring(E);a+=c.length;\\nb.append(c);var f=C+1;while(a\\x3ce){var d=P(f);a+=d.length;b.append(d);f++;}return b.toString().substring(0,e);\\n}function W(b){var a={};return function(c){if(!a[c]){a[c]=b(c);}return a[c];};}var K=[];var L=[];while(N.hasNext()){var B=N.next();\\nif(B.opcode=="="){if(B.attribs){K.length=0;L.length=0;Changeset.eachAttribNumber(B.attribs,function(a){K.push(J.getAttribKey(a));\\nL.push(J.getAttribValue(a));});var T=W(function(f){var d=[];for(var a=0;a\\x3cK.length;a++){var c=K[a];var e=L[a];\\nvar b=Changeset.attribsAttributeValue(f,c,J);if(e!=b){d.push([c,b]);}}return Changeset.makeAttribsString("=",d,J);\\n});M(B.chars,function(a,c,b){H.keep(a,b?1:0,T(c));});}else{X(B.chars,B.lines);H.keep(B.chars,B.lines);\\n}}else{if(B.opcode=="+"){H.remove(B.chars,B.lines);}else{if(B.opcode=="-"){var V=S(B.chars);var O=0;M(B.chars,function(a,b,c){H.insert(V.substr(O,a),b);\\nO+=a;});}}}}return Changeset.checkRep(H.toString());};Changeset.follow=function(N,L,K,G){var C=Changeset.unpack(N);\\nvar B=Changeset.unpack(L);var O=C.oldLen;var M=B.oldLen;Changeset.assert(O==M,"mismatched follow");var I=Changeset.stringIterator(C.charBank);\\nvar H=Changeset.stringIterator(B.charBank);var F=C.newLen;var D=0;var A=0;var E=Changeset.attributeTester(["insertorder","first"],G);\\nvar J=Changeset.applyZip(C.ops,0,B.ops,0,function(Q,P,R){if(Q.opcode=="+"||P.opcode=="+"){var S;if(P.opcode!="+"){S=1;\\n}else{if(Q.opcode!="+"){S=2;}else{var V=I.peek(1);var T=H.peek(1);var W=E(Q.attribs);var U=E(P.attribs);\\nif(W&&!U){S=1;}else{if(U&&!W){S=2;}else{if(V=="\\\\n"&&T!="\\\\n"){S=2;}else{if(V!="\\\\n"&&T=="\\\\n"){S=1;}else{if(K){S=2;\\n}else{S=1;}}}}}}}if(S==1){I.skip(Q.chars);R.opcode="=";R.lines=Q.lines;R.chars=Q.chars;R.attribs="";Q.opcode="";\\n}else{H.skip(P.chars);Changeset.copyOp(P,R);P.opcode="";}}else{if(Q.opcode=="-"){if(!P.opcode){Q.opcode="";\\n}else{if(Q.chars\\x3c=P.chars){P.chars-=Q.chars;P.lines-=Q.lines;Q.opcode="";if(!P.chars){P.opcode="";}}else{Q.chars-=P.chars;\\nQ.lines-=P.lines;P.opcode="";}}}else{if(P.opcode=="-"){Changeset.copyOp(P,R);if(!Q.opcode){P.opcode="";\\n}else{if(P.chars\\x3c=Q.chars){Q.chars-=P.chars;Q.lines-=P.lines;P.opcode="";if(!Q.chars){Q.opcode="";}}else{R.lines=Q.lines;\\nR.chars=Q.chars;P.lines-=Q.lines;P.chars-=Q.chars;Q.opcode="";}}}else{if(!Q.opcode){Changeset.copyOp(P,R);\\nP.opcode="";}else{if(!P.opcode){Changeset.copyOp(Q,R);Q.opcode="";}else{R.opcode="=";R.attribs=Changeset.followAttributes(Q.attribs,P.attribs,G);\\nif(Q.chars\\x3c=P.chars){R.chars=Q.chars;R.lines=Q.lines;P.chars-=Q.chars;P.lines-=Q.lines;Q.opcode="";if(!P.chars){P.opcode="";\\n}}else{R.chars=P.chars;R.lines=P.lines;Q.chars-=P.chars;Q.lines-=P.lines;P.opcode="";}}}}}}switch(R.opcode){case"=":D+=R.chars;\\nA+=R.chars;break;case"-":D+=R.chars;break;case"+":A+=R.chars;break;}});A+=F-D;return Changeset.pack(F,A,J,B.charBank);\\n};Changeset.followAttributes=function(F,E,B){if((!E)||(!B)){return"";}if(!F){return E;}var A=[];E.replace(/\\\\*([0-9a-z]+)/g,function(H,G){A.push(B.getAttrib(Changeset.parseNum(G)));\\nreturn"";});F.replace(/\\\\*([0-9a-z]+)/g,function(K,J){var I=B.getAttrib(Changeset.parseNum(J));for(var G=0;\\nG\\x3cA.length;G++){var H=A[G];if(I[0]==H[0]){if(I[1]\\x3c=H[1]){A.splice(G,1);}break;}}return"";});var C=Changeset.stringAssembler();\\nfor(var D=0;D\\x3cA.length;D++){C.append("*");C.append(Changeset.numToString(B.putAttrib(A[D])));}return C.toString();\\n};function makeCSSManager(I){function E(N){var M=document.styleSheets;for(var K=0;K\\x3cM.length;K++){var L=M[K];\\nif(L.title==N){return L;}}return null;}var A=E(I);function C(){return(A.cssRules||A.rules);}function H(K){if(A.deleteRule){A.deleteRule(K);\\n}else{A.removeRule(K);}}function F(L,K){if(A.insertRule){A.insertRule(K+" {}",L);}else{A.addRule(K,null,L);\\n}}var B=[];function D(L){for(var K=0;K\\x3cB.length;K++){if(B[K]==L){return K;}}return -1;}function G(K){var L=D(K);\\nif(L\\x3c0){F(0,K);B.splice(0,0,K);L=0;}return C().item(L).style;}function J(L){var K=D(L);if(K>=0){H(K);\\nB.splice(K,1);}}return{selectorStyle:G,removeSelectorStyle:J,info:function(){return B.length+":"+C().length;\\n}};}var colorutils={};colorutils.css2triple=function(C){var B=colorutils.css2sixhex(C);function A(D){return Number("0x"+D)/255;\\n}return[A(B.substr(0,2)),A(B.substr(2,2)),A(B.substr(4,2))];};colorutils.css2sixhex=function(E){var A=/[0-9a-fA-F]+/.exec(E)[0];\\nif(A.length!=6){var C=A.charAt(0);var B=A.charAt(1);var D=A.charAt(2);A=C+C+B+B+D+D;}return A;};colorutils.triple2css=function(B){function A(D){var C=colorutils.clamp(Math.round(D*255),0,255);\\nreturn("0"+C.toString(16)).slice(-2);}return"#"+A(B[0])+A(B[1])+A(B[2]);};colorutils.clamp=function(A,C,B){return A\\x3cC?C:(A>B?B:A);\\n};colorutils.min3=function(C,B,A){return(C\\x3cB)?(C\\x3cA?C:A):(B\\x3cA?B:A);};colorutils.max3=function(C,B,A){return(C>B)?(C>A?C:A):(B>A?B:A);\\n};colorutils.colorMin=function(A){return colorutils.min3(A[0],A[1],A[2]);};colorutils.colorMax=function(A){return colorutils.max3(A[0],A[1],A[2]);\\n};colorutils.scale=function(B,A,C){return colorutils.clamp(A+B*(C-A),0,1);};colorutils.unscale=function(B,A,C){return colorutils.clamp((B-A)/(C-A),0,1);\\n};colorutils.scaleColor=function(C,B,A){return[colorutils.scale(C[0],B,A),colorutils.scale(C[1],B,A),colorutils.scale(C[2],B,A)];\\n};colorutils.unscaleColor=function(C,B,A){return[colorutils.unscale(C[0],B,A),colorutils.unscale(C[1],B,A),colorutils.unscale(C[2],B,A)];\\n};colorutils.luminosity=function(A){return A[0]*0.3+A[1]*0.59+A[2]*0.11;};colorutils.saturate=function(A){var C=colorutils.colorMin(A);\\nvar B=colorutils.colorMax(A);if(B-C\\x3c=0){return[1,1,1];}return colorutils.unscaleColor(A,C,B);};colorutils.blend=function(C,B,A){return[colorutils.scale(A,C[0],B[0]),colorutils.scale(A,C[1],B[1]),colorutils.scale(A,C[2],B[2])];\\n};undoModule=(function(){var A=(function(){var M=[];var O=0;var Q="undoableEvent";var N="externalChange";\\nfunction P(){M.length=0;M.push({elementType:Q,eventType:"bottom"});O=1;}P();function T(Y){var X=extend({},Y);\\nX.elementType=Q;M.push(X);O++;}function U(Y){var X=M.length-1;if(M[X].elementType==N){M[X].changeset=Changeset.compose(M[X].changeset,Y,D());\\n}else{M.push({elementType:N,changeset:Y});}}function R(e){var c=M.length-1-e;var X=M.length-1;while(X>c||M[X].elementType==N){if(M[X].elementType==N){var Z=M[X];\\nvar Y=M[X-1];if(Y.backset){var b=Z.changeset;var d=Y.backset;Y.backset=Changeset.follow(b,Y.backset,false,D());\\nZ.changeset=Changeset.follow(d,Z.changeset,true,D());if((typeof Y.selStart)=="number"){var a=Changeset.characterRangeFollow(b,Y.selStart,Y.selEnd);\\nY.selStart=a[0];Y.selEnd=a[1];if(Y.selStart==Y.selEnd){Y.selFocusAtStart=false;}}}M[X-1]=Z;M[X]=Y;if(X>=2&&M[X-2].elementType==N){Z.changeset=Changeset.compose(M[X-2].changeset,Z.changeset,D());\\nM.splice(X-2,1);X--;}}else{X--;}}}function W(X){R(X);return M[M.length-1-X];}function V(){return O;}function S(){R(0);\\nO--;return M.pop();}return{numEvents:V,popEvent:S,pushEvent:T,pushExternalChange:U,clearStack:P,getNthFromTop:W};\\n})();var B=0;function J(){A.clearStack();B=0;}function H(O,P){var M=0;var N=0;while(M>=0&&M\\x3cO.length){M=O.indexOf(P,M);\\nif(M>=0){N++;M++;}}return N;}function C(M,N){return H(Changeset.unpack(M).ops,N);}function K(N,M){if(!N){return M;\\n}if(!M){return N;}var U=C(N,"+");var T=C(M,"+");var R=C(N,"-");var Q=C(M,"-");if(U==1&&T==1&&R==0&&Q==0){var O=Changeset.compose(N,M,D());\\nvar S=C(O,"+");var P=C(O,"-");if(S==1&&P==0){return O;}}else{if(U==0&&T==0&&R==1&&Q==1){var O=Changeset.compose(N,M,D());\\nvar S=C(O,"+");var P=C(O,"-");if(S==0&&P==1){return O;}}}return null;}function I(M){var N=A.getNthFromTop(0);\\nfunction P(){if((typeof M.selStart)=="number"){N.selStart=M.selStart;N.selEnd=M.selEnd;N.selFocusAtStart=M.selFocusAtStart;\\n}}if((!M.backset)||Changeset.isIdentity(M.backset)){P();}else{var O=false;if(N.eventType==M.eventType){var Q=K(M.backset,N.backset);\\nif(Q){N.backset=Q;P();O=true;}}if(!O){A.pushEvent(M);}B=0;}}function G(M){if(M&&!Changeset.isIdentity(M)){A.pushExternalChange(M);\\n}}function E(M){if((typeof M.selStart)!="number"){return null;}else{return{selStart:M.selStart,selEnd:M.selEnd,selFocusAtStart:M.selFocusAtStart};\\n}}function F(M){if(B\\x3cA.numEvents()-1){var O=A.getNthFromTop(B);var N=A.getNthFromTop(B+1);var P=M(O.backset,E(N));\\nA.pushEvent(P);B+=2;}else{M();}}function L(M){if(B>=2){var O=A.getNthFromTop(0);var N=A.getNthFromTop(1);\\nM(O.backset,E(N));A.popEvent();B-=2;}else{M();}}function D(){return undoModule.apool;}return{clearHistory:J,reportEvent:I,reportExternalChange:G,performUndo:F,performRedo:L,enabled:true,apool:null};\\n})();var _MAX_LIST_LEVEL=8;function sanitizeUnicode(A){return A.replace(/[\\\\uffff\\\\ufffe\\\\ufeff\\\\ufdd0-\\\\ufdef\\\\ud800-\\\\udfff]/g,"?");\\n}function makeContentCollector(h,H,M,Y,U){H=H||{};var B=Y||{isNodeText:function(k){return(k.nodeType==3);\\n},nodeTagName:function(k){return k.tagName;},nodeValue:function(k){return k.nodeValue;},nodeNumChildren:function(k){return k.childNodes.length;\\n},nodeChild:function(l,k){return l.childNodes.item(k);},nodeProp:function(l,k){return l[k];},nodeAttr:function(l,k){return l.getAttribute(k);\\n},optNodeInnerHTML:function(k){return k.innerHTML;}};var i={div:1,p:1,pre:1,li:1};function R(k){return !!i[(B.nodeTagName(k)||"").toLowerCase()];\\n}function e(k){return sanitizeUnicode(k.replace(/[\\\\n\\\\r ]/g," ").replace(/\\\\xa0/g," ").replace(/\\\\t/g,"        "));\\n}function Q(l,k){return B.nodeProp(l,"_magicdom_"+k);}var A=(function(){var k=[];var o=[];var l=null;\\nvar n=Changeset.newOp("+");var m={length:function(){return k.length;},atColumnZero:function(){return k[k.length-1]==="";\\n},startNew:function(){k.push("");m.flush(true);l=Changeset.smartOpAssembler();},textOfLine:function(p){return k[p];\\n},appendText:function(p,q){k[k.length-1]+=p;n.attribs=q;n.chars=p.length;l.append(n);},textLines:function(){return k.slice();\\n},attribLines:function(){return o;},flush:function(p){if(l){o.push(l.toString());l=null;}}};m.startNew();\\nreturn m;}());var E={};function O(k){if(!A.atColumnZero()){K(k);}}var N,D,C;var J=[-1,-1],I=[-1,-1];var j={div:1,p:1,pre:1};\\nfunction S(k,l){if(B.nodeNumChildren(k)==0){return true;}if(B.nodeNumChildren(k)==1&&Q(k,"shouldBeEmpty")&&B.optNodeInnerHTML(k)=="&nbsp;"&&!Q(k,"unpasted")){if(l){var m=B.nodeChild(k,0);\\nL(m,0,l);L(m,1,l);}return true;}return false;}function F(n,m){var l=A.length()-1;var k=A.textOfLine(l).length;\\nif(k==0&&m.listType&&m.listType!="none"){k+=1;}k+=n;return[l,k];}function P(k,l,m){if(!B.isNodeText(k)){L(k,l,m);\\n}}function L(m,k,l){if(D&&m==D.node&&D.index==k){J=F(0,l);}if(C&&m==C.node&&C.index==k){I=F(0,l);}}function b(k,l){k.flags[l]=(k.flags[l]||0)+1;\\n}function W(k,l){k.flags[l]--;}function X(k,l){if(!k.attribs[l]){k.attribs[l]=1;}else{k.attribs[l]++;\\n}G(k);}function f(k,l){k.attribs[l]--;G(k);}function T(k,l){var m=k.listType;k.listLevel=(k.listLevel||0)+1;\\nif(l!="none"){k.listNesting=(k.listNesting||0)+1;}k.listType=l;G(k);return m;}function d(k,l){k.listLevel--;\\nif(k.listType!="none"){k.listNesting--;}k.listType=l;G(k);}function c(k,m){var l=k.author;k.authorLevel=(k.authorLevel||0)+1;\\nk.author=m;G(k);return l;}function g(k,l){k.authorLevel--;k.author=l;G(k);}function G(k){var l=[];for(var m in k.attribs){if(k.attribs[m]){l.push([m,"true"]);\\n}}if(k.authorLevel>0){var n=["author",k.author];if(M.putAttrib(n,true)>=0){l.push(n);}}k.attribString=Changeset.makeAttribsString("+",l,M);\\n}function V(k){A.appendText("*",Changeset.makeAttribsString("+",[["list",k.listType],["insertorder","first"]],M));\\n}function K(k){if(k){var l=A.textOfLine(A.length()-1).length==0;if(l&&k.listType&&k.listType!="none"){V(k);\\n}}A.startNew();}E.notifySelection=function(k){if(k){N=k;D=N.startPoint;C=N.endPoint;}};E.collectContent=function(l,k){if(!k){k={flags:{},attribs:{},attribString:""};\\n}var AF=R(l);var AK=S(l,k);if(AF){O(k);}var AL=A.length()-1;P(l,0,k);if(B.isNodeText(l)){var n=B.nodeValue(l);\\nvar AG="";var s=0;if(n.length==0){if(D&&l==D.node){J=F(0,k);}if(C&&l==C.node){I=F(0,k);}}while(n.length>0){var AA=0;\\nif(k.flags.preMode){var AE=n.split("\\\\n",1)[0];AA=AE.length+1;AG=n.substring(AA);n=AE;}else{}if(D&&l==D.node&&D.index-s\\x3c=n.length){J=F(D.index-s,k);\\n}if(C&&l==C.node&&C.index-s\\x3c=n.length){I=F(C.index-s,k);}var t=n;if((!k.flags.preMode)&&/^[\\\\r\\\\n]*$/.exec(n)){t="";\\n}var AC=A.textOfLine(A.length()-1).length==0;if(AC){t=t.replace(/^\\\\n*/,"");}if(AC&&k.listType&&k.listType!="none"){V(k);\\n}A.appendText(e(t),k.attribString);s+=AA;n=AG;if(n.length>0){K(k);}}}else{var m=(B.nodeTagName(l)||"").toLowerCase();\\nif(m=="br"){K(k);}else{if(m=="script"||m=="style"){}else{if(!AK){var o=B.nodeAttr(l,"style");var q=B.nodeProp(l,"className");\\nvar w=(m=="pre");if((!w)&&H.safari){w=(o&&/\\\\bwhite-space:\\\\s*pre\\\\b/i.exec(o));}if(w){b(k,"preMode");}var r=null;\\nvar v=null;var AB=null;if(h){function u(x){r=(r||[]);r.push(x);X(k,x);}if(m=="b"||(o&&/\\\\bfont-weight:\\\\s*bold\\\\b/i.exec(o))||m=="strong"){u("bold");\\n}if(m=="i"||(o&&/\\\\bfont-style:\\\\s*italic\\\\b/i.exec(o))||m=="em"){u("italic");}if(m=="u"||(o&&/\\\\btext-decoration:\\\\s*underline\\\\b/i.exec(o))||m=="ins"){u("underline");\\n}if(m=="s"||(o&&/\\\\btext-decoration:\\\\s*line-through\\\\b/i.exec(o))||m=="del"){u("strikethrough");}if(m=="ul"){var z;\\nvar AD=q&&/(?:^| )list-(bullet[12345678])\\\\b/.exec(q);z=AD&&AD[1]||"bullet"+String(Math.min(_MAX_LIST_LEVEL,(k.listNesting||0)+1));\\nv=(T(k,z)||"none");}else{if((m=="div"||m=="p")&&q&&q.match(/(?:^| )ace-line\\\\b/)){v=(T(k,z)||"none");}}if(U&&q){var y=q.match(/\\\\S+/g);\\nif(y&&y.length>0){for(var p=0;p\\x3cy.length;p++){var AH=y[p];var AI=U(AH);if(AI){AB=(c(k,AI)||"none");break;\\n}}}}}var AJ=B.nodeNumChildren(l);for(var p=0;p\\x3cAJ;p++){var AH=B.nodeChild(l,p);E.collectContent(AH,k);\\n}if(w){W(k,"preMode");}if(r){for(var p=0;p\\x3cr.length;p++){f(k,r[p]);}}if(v){d(k,v);}if(AB){g(k,AB);}}}}}if(!H.msie){P(l,1,k);\\n}if(AF){if(A.length()-1==AL){K(k);}else{O(k);}}if(H.msie){P(l,1,k);}};E.notifyNextNode=function(k){if((!k)||(R(k)&&!S(k))){O(null);\\n}};var a=function(){return J;};var Z=function(){return I;};E.getLines=function(){return A.textLines();\\n};E.finish=function(){A.flush();var l=A.attribLines();var k=E.getLines();k.length--;l.length--;var n=a();\\nvar o=Z();function p(){var v=2000;var z=10;var x=0;var w=0;for(var q=k.length-1;q>=0;q--){var s=k[q];\\nvar u=l[q];if(s.length>v+z){var r=[];var t=[];while(s.length>v){lengthToTake=v;r.push(s.substring(0,lengthToTake));\\ns=s.substring(lengthToTake);t.push(Changeset.subattribution(u,0,lengthToTake));u=Changeset.subattribution(u,lengthToTake);\\n}if(s.length>0){r.push(s);t.push(u);}function y(AA){if(AA[0]\\x3c0){return;}var AB=AA[0];var AD=AA[1];if(AB>q){AB+=(r.length-1);\\n}else{if(AB==q){var AC=0;while(AD>r[AC].length){AD-=r[AC].length;AC++;}AB+=AC;}}AA[0]=AB;AA[1]=AD;}y(n);\\ny(o);x++;w+=r.length;r.unshift(q,1);k.splice.apply(k,r);t.unshift(q,1);l.splice.apply(l,t);}}return{linesWrapped:x,numLinesAfter:w};\\n}var m=p();return{selStart:n,selEnd:o,linesWrapped:m.linesWrapped,numLinesAfter:m.numLinesAfter,lines:k,lineAttribs:l};\\n};return E;}function makeChangesetTracker(K,A,J){var D=Changeset.makeAText("\\\\n");var B=null;var C=Changeset.identity(1);\\nvar F=false;var E=false;var G=null;var H=null;function L(){if(G&&H===null){H=K.setTimeout(function(){try{G();\\n}finally{H=null;}},0);}}var I;return I={isTracking:function(){return F;},setBaseText:function(M){I.setBaseAttributedText(Changeset.makeAText(M),null);\\n},setBaseAttributedText:function(M,N){J.withCallbacks("setBaseText",function(P){F=true;D=Changeset.cloneAText(M);\\nif(N){var O=(new AttribPool()).fromJsonable(N);D.attribs=Changeset.moveOpsToNewPool(D.attribs,O,A);}B=null;\\nC=Changeset.identity(M.text.length);E=true;try{P.setDocumentAttributedText(M);}finally{E=false;}});},composeUserChangeset:function(M){if(!F){return;\\n}if(E){return;}if(Changeset.isIdentity(M)){return;}C=Changeset.compose(C,M,A);L();},applyChangesToBase:function(M,O,N){if(!F){return;\\n}J.withCallbacks("applyChangesToBase",function(V){if(N){var U=(new AttribPool()).fromJsonable(N);M=Changeset.moveOpsToNewPool(M,U,A);\\n}D=Changeset.applyToAText(M,D,A);var P=M;if(B){var Q=B;B=Changeset.follow(M,Q,false,A);P=Changeset.follow(Q,M,true,A);\\n}var R=true;var S=C;C=Changeset.follow(P,S,R,A);var T=Changeset.follow(S,P,!R,A);var W=true;E=true;try{V.applyChangesetToDocument(T,W);\\n}finally{E=false;}});},prepareUserChangeset:function(){var M;if(B){M=Changeset.compose(B,C,A);}else{if(Changeset.isIdentity(C)){M=null;\\n}else{M=C;}}var N=null;if(M){B=M;C=Changeset.identity(Changeset.newLen(M));N=M;}var P=null;if(N){var O=Changeset.prepareForWire(N,A);\\nP=O.pool.toJsonable();N=O.translated;}var Q={changeset:N,apool:P};return Q;},applyPreparedChangesetToBase:function(){if(!B){throw new Error("applySubmittedChangesToBase: no submitted changes to apply");\\n}D=Changeset.applyToAText(B,D,A);B=null;},setUserChangeNotificationCallback:function(M){G=M;},hasUncommittedChanges:function(){return !!(B||(!Changeset.isIdentity(C)));\\n}};}var linestylefilter={};linestylefilter.ATTRIB_CLASSES={bold:"tag:b",italic:"tag:i",underline:"tag:u",strikethrough:"tag:s"};\\nlinestylefilter.getAuthorClassName=function(A){return"author-"+A.replace(/[^a-y0-9]/g,function(B){if(B=="."){return"-";\\n}return"z"+B.charCodeAt(0)+"z";});};linestylefilter.getLineStyleFilter=function(B,E,A,D){if(B==0){return A;\\n}var C=A;var F=(function(){var N=B;var L=0;var J;var G;function P(R){var Q="";Changeset.eachAttribNumber(R,function(U){var S=D.getAttribKey(U);\\nif(S){var T=D.getAttribValue(U);if(T){if(S=="author"){Q+=" "+linestylefilter.getAuthorClassName(T);}else{if(S=="list"){Q+=" list:"+T;\\n}else{if(linestylefilter.ATTRIB_CLASSES[S]){Q+=" "+linestylefilter.ATTRIB_CLASSES[S];}}}}}});return Q.substring(1);\\n}var O=Changeset.opIterator(E);var H,I;function K(){H=O.next();I=(H.opcode&&P(H.attribs));}K();function M(){if(L\\x3cN){J=I;\\nG=H.chars;K();while(H.opcode&&I==J){G+=H.chars;K();}}}M();return function(Q,S){while(Q.length>0){if(G\\x3c=0){return C(Q,S);\\n}var R=Q.length;if(R>G){R=G;}var T=Q.substring(0,R);Q=Q.substring(R);C(T,(S&&S+" ")+J);L+=R;G-=R;if(G==0){M();\\n}}};})();return F;};linestylefilter.getAtSignSplitterFilter=function(E,C){var B=/@/g;B.lastIndex=0;var A=null;\\nvar D;while((D=B.exec(E))){if(!A){A=[];}A.push(D.index);}if(!A){return C;}return linestylefilter.textAndClassFuncSplitter(C,A);\\n};linestylefilter.REGEX_WORDCHAR=/[\\\\u0030-\\\\u0039\\\\u0041-\\\\u005A\\\\u0061-\\\\u007A\\\\u00C0-\\\\u00D6\\\\u00D8-\\\\u00F6\\\\u00F8-\\\\u00FF\\\\u0100-\\\\u1FFF\\\\u3040-\\\\u9FFF\\\\uF900-\\\\uFDFF\\\\uFE70-\\\\uFEFE\\\\uFF10-\\\\uFF19\\\\uFF21-\\\\uFF3A\\\\uFF41-\\\\uFF5A\\\\uFF66-\\\\uFFDC]/;\\nlinestylefilter.REGEX_URLCHAR=new RegExp("("+/[-:@a-zA-Z0-9_.,~%+\\\\\\x2f\\\\\\\\?=&#;()$]/.source+"|"+linestylefilter.REGEX_WORDCHAR.source+")");\\nlinestylefilter.REGEX_URL=new RegExp(/(?:(?:https?|s?ftp|ftps|file|smb|afp|nfs|(x-)?man|gopher|txmt):\\\\\\x2f\\\\\\x2f|mailto:)/.source+linestylefilter.REGEX_URLCHAR.source+"*(?![:.,;])"+linestylefilter.REGEX_URLCHAR.source,"g");\\nlinestylefilter.getURLFilter=function(I,F){linestylefilter.REGEX_URL.lastIndex=0;var A=null;var C=null;\\nvar B;while((B=linestylefilter.REGEX_URL.exec(I))){if(!A){A=[];C=[];}var D=B.index;var E=B[0];A.push([D,E]);\\nC.push(D,D+E.length);}if(!A){return F;}function G(L){for(var K=0;K\\x3cA.length;K++){var J=A[K];if(L>=J[0]&&L\\x3cJ[0]+J[1].length){return J[1];\\n}}return false;}var H=(function(){var J=0;return function(K,N){var O=K.length;var M=N;var L=G(J);if(L){M+=" url:"+L;\\n}F(K,M);J+=O;};})();return linestylefilter.textAndClassFuncSplitter(H,C);};linestylefilter.textAndClassFuncSplitter=function(D,B){var A=0;\\nvar C=0;while(B&&A\\x3cB.length&&B[A]==0){A++;}function E(F,H){if((!B)||A>=B.length){D(F,H);C+=F.length;}else{var J=B;\\nvar G=J[A]-C;var I=F.length;if(G>=I){D(F,H);C+=F.length;if(G==I){A++;}}else{if(G>0){D(F.substring(0,G),H);\\nC+=G;}A++;E(F.substring(G),H);}}}return E;};linestylefilter.populateDomLine=function(F,D,E,G){var A=F;\\nif(A.slice(-1)=="\\\\n"){A=A.substring(0,A.length-1);}function C(H,I){G.appendSpan(H,I);}var B=C;B=linestylefilter.getURLFilter(A,B);\\nB=linestylefilter.getLineStyleFilter(A.length,D,B,E);B(A,"");};var domline={};domline.noop=function(){};\\ndomline.identity=function(A){return A;};domline.addToLineClass=function(A,B){B.replace(/\\\\S+/g,function(C){if(C.indexOf("line:")==0){A=(A?A+" ":"")+C.substring(5);\\n}});return A;};domline.createDomLine=function(N,H,J,O){var A={node:null,appendSpan:domline.noop,prepareForAdd:domline.noop,notifyAdded:domline.noop,clearSpans:domline.noop,finishUpdate:domline.noop,lineMarker:0};\\nvar M=(J||{});var G=O;if(G){A.node=G.createElement("div");}else{A.node={innerHTML:"",className:""};}var D=[];\\nvar F,E;var C=null;function K(R){return domline.processSpaces(R,H);}var L=domline.identity;var Q=(H?L:K);\\nvar P=(H?K:L);var B="ace-line";A.appendSpan=function(W,R){if(R.indexOf("list")>=0){var U=/(?:^| )list:(\\\\S+)/.exec(R);\\nif(U){U=U[1];if(U){F=\\\'\\x3cul class="list-\\\'+U+\\\'">\\x3cli>\\\';E="\\x3c/li>\\x3c/ul>";}A.lineMarker+=W.length;return;}}var X=null;\\nvar S=null;if(R.indexOf("url")>=0){R=R.replace(/(^| )url:(\\\\S+)/g,function(a,Z,Y){X=Y;return Z+"url";});\\n}if(R.indexOf("tag")>=0){R=R.replace(/(^| )tag:(\\\\S+)/g,function(a,Z,Y){if(!S){S=[];}S.push(Y.toLowerCase());\\nreturn Z+Y;});}if((!W)&&R){B=domline.addToLineClass(B,R);}else{if(W){var T="";var V="";if(X){T=T+\\\'\\x3ca href="\\\'+X.replace(/\\\\"/g,"&quot;")+\\\'">\\\';\\nV="\\x3c/a>"+V;}if(S){S.sort();T=T+"\\x3c"+S.join(">\\x3c")+">";S.reverse();V="\\x3c/"+S.join(">\\x3c/")+">"+V;}D.push(\\\'\\x3cspan class="\\\',R||"",\\\'">\\\',T,Q(domline.escapeHTML(W)),V,"\\x3c/span>");\\n}}};A.clearSpans=function(){D=[];B="";A.lineMarker=0;};function I(){var R=P(D.join(""));if(!R){if((!G)||(!J)){R+="&nbsp;";\\n}else{if(!M.msie){R+="\\x3cbr/>";}}}if(N){R=(F||"")+R+(E||"");}D=F=E=null;if(R!==C){C=R;A.node.innerHTML=C;\\n}if(B!==null){A.node.className=B;}}A.prepareForAdd=I;A.finishUpdate=I;A.getInnerHTML=function(){return C||"";\\n};return A;};domline.escapeHTML=function(B){var A=/[&\\x3c>\\\'"]/g;/\\\']/;if(!A.MAP){A.MAP={"&":"&amp;","\\x3c":"&lt;",">":"&gt;",\\\'"\\\':"&#34;","\\\'":"&#39;"};\\n}return B.replace(A,function(C){return A.MAP[C];});};domline.processSpaces=function(F,G){if(F.indexOf("\\x3c")\\x3c0&&!G){return F.replace(/ /g,"&nbsp;");\\n}var B=[];F.replace(/\\x3c[^>]*>?| |[^ \\x3c]+/g,function(H){B.push(H);});if(G){var D=true;var E=false;for(var A=B.length-1;\\nA>=0;A--){var C=B[A];if(C==" "){if(D||E){B[A]="&nbsp;";}D=false;E=true;}else{if(C.charAt(0)!="\\x3c"){D=false;\\nE=false;}}}for(var A=0;A\\x3cB.length;A++){var C=B[A];if(C==" "){B[A]="&nbsp;";break;}else{if(C.charAt(0)!="\\x3c"){break;\\n}}}}else{for(var A=0;A\\x3cB.length;A++){var C=B[A];if(C==" "){B[A]="&nbsp;";}}}return B.join("");};\'+\'//-->\\n\\x3c/script>\')'));
T.push(('(\'\\x3cscript type="text/javascript">//<!--\\n\'+\'function OUTER(Cj){var AK=false;var B4=false;var Ad="    ";var BW=8;var BO=4;var CC=4;var Ah=20;var Bj=8;\\nvar BS=8;var BU=[];var e="";var BL=false;var D=parent.editorInfo;var g=window.frameElement;var F=g.ace_outerWin;\\ng.ace_outerWin=null;var T=g.nextSibling;var w=T.nextSibling;var Cb=w.nextSibling;BX();var Au=function(i){};\\nvar Ar=function(i){return true;};var An=function(){};var A={lines:newSkipList(),selStart:null,selEnd:null,selFocusAtStart:false,alltext:"",alines:[],apool:new AttribPool()};\\nif(undoModule.enabled){undoModule.apool=A.apool;}var B,E;var k=true;var K=true;var AP=true;var AX=true;\\nvar p=Ah+BO+BS;var Aj=Bj;var Bo=0,CQ=0;var S=(AK&&top.console);if(!S){var Al=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];\\nS={};for(var Ag=0;Ag\\x3cAl.length;++Ag){S[Al[Ag]]=function(){};}}var O=window.PROFILER;if(!O){O=function(){return{start:I,mark:I,literal:I,end:I,cancel:I};\\n};}function I(){}function Ce(i){return i;}var v=I;window.dmesg=I;var N=parent;var AQ="monospace";var u=12;\\nfunction AV(){return Math.round(u*4/3);}var W=null;function Bh(){W=makeCSSManager("dynamicsyntax");}var M=makeChangesetTracker(N,A.apool,{withCallbacks:function(i,Cp){Y(i,function(){G(1);\\nCp({setDocumentAttributedText:function(Cq){Aa(Cq);},applyChangesetToDocument:function(Cs,Cr){var Cq=C.editEvent.eventType;\\nC.startNewEvent("nonundoable");b(Cs,Cr);C.startNewEvent(Cq);}});});}});var Ao={};function CV(i,Cp){if((typeof i)!="string"){throw new Error("setAuthorInfo: author ("+i+") is not a string");\\n}if(!Cp){delete Ao[i];if(W){W.removeSelectorStyle(Av(BP(i)));}}else{Ao[i]=Cp;if(Cp.bgcolor){if(W){var Cq=Cp.bgcolor;\\nif((typeof Cp.fade)=="number"){Cq=BZ(Cq,Cp.fade);}W.selectorStyle(Av(BP(i))).backgroundColor=Cq;}}}}function BP(i){return"author-"+i.replace(/[^a-y0-9]/g,function(Cp){if(Cp=="."){return"-";\\n}return"z"+Cp.charCodeAt(0)+"z";});}function Bd(i){if(i.substring(0,7)=="author-"){return i.substring(7).replace(/[a-y0-9]+|-|z.+?z/g,function(Cp){if(Cp=="-"){return".";\\n}else{if(Cp.charAt(0)=="z"){return String.fromCharCode(Number(Cp.slice(1,-1)));}else{return Cp;}}});}return null;\\n}function Av(i){return".authorColors ."+i;}function AS(){if(W){var Cp=w.offsetHeight;var Cq=AV();var i=0;\\nvar Cs=0;if(Cp\\x3cCq){i=Math.ceil((Cq-Cp)/2);Cs=Cq-Cp-i;}var Cr=W.selectorStyle("#innerdocbody span");Cr.paddingTop=Cs+"px";\\nCr.paddingBottom=i+"px";}}function Ci(Cp){var i=colorutils.css2triple(Cp);i=colorutils.saturate(i);i=colorutils.scaleColor(i,0,0.5/colorutils.luminosity(i));\\nreturn colorutils.triple2css(i);}function BZ(Cp,Cq){var i=colorutils.css2triple(Cp);i=colorutils.blend(i,[1,1,1],Cq);\\nreturn colorutils.triple2css(i);}function By(i){N.setTimeout(function(){alert(i);},0);}var C=null;function a(Cq,Cx){if(BL){return;\\n}if(C){S.error("Can\\\'t enter callstack "+Cq+", already in "+C.type);}var Ct=false;function Cw(){Ct=true;\\nS.profile();}function Cr(Cz){return{eventType:Cz,backset:null};}function Cs(Cz){if(A.selStart&&A.selEnd){var C2=A.lines.offsetOfIndex(A.selStart[0])+A.selStart[1];\\nvar C1=A.lines.offsetOfIndex(A.selEnd[0])+A.selEnd[1];Cz.selStart=C2;Cz.selEnd=C1;Cz.selFocusAtStart=A.selFocusAtStart;\\n}if(undoModule.enabled){var C0=false;try{if(Cz.eventType=="setup"||Cz.eventType=="importText"||Cz.eventType=="setBaseText"){undoModule.clearHistory();\\n}else{if(Cz.eventType=="nonundoable"){if(Cz.changeset){undoModule.reportExternalChange(Cz.changeset);\\n}}else{undoModule.reportEvent(Cz);}}C0=true;}finally{if(!C0){undoModule.enabled=false;}}}}function Cy(C1,C0){var Cz=C.editEvent;\\nif(!C0){Cs(Cz);}C.editEvent=Cr(C1);return Cz;}C={type:Cq,docTextChanged:false,selectionAffected:false,userChangedSelection:false,domClean:false,profileRest:Cw,isUserChange:false,repChanged:false,editEvent:Cr(Cq),startNewEvent:Cy};\\nvar Cu=false;var Cv;try{Cv=Cx();Cu=true;}catch(Cp){BU.push({error:Cp,time:+new Date()});v(Cp.toString());\\nthrow Cp;}finally{var i=C;if(Cu){Cs(i.editEvent);if(i.domClean&&i.type!="setup"){if(i.isUserChange){if(i.repChanged){AG.notifyChange();\\n}else{AG.notifyTick();}}Be.recolorLines();if(i.selectionAffected){Ba();}if((i.docTextChanged||i.userChangedSelection)&&i.type!="applyChangesToBase"){CP();\\n}if(i.docTextChanged&&i.type.indexOf("importText")\\x3c0){An();}}}else{if(C.type=="idleWorkTimer"){H.atLeast(1000);\\n}}C=null;if(Ct){S.profileEnd();}}return Cv;}function Y(Cp,i){if(!C){a(Cp,i);}else{i();}}function Af(i){if(A.lines.containsKey(i)){var Cp=A.lines.offsetOfKey(i);\\nvar Cq=A.lines.atKey(i).width;AU(Cp,Cp+Cq);}}function AL(i){return A.lines.atOffset(i).key;}var Be=(function(){var i={};\\nvar Cp={};Cp.setCharNeedsRecoloring=function(Cq){if(Cq>=A.alltext.length){Cq=A.alltext.length-1;}i[AL(Cq)]=true;\\n};Cp.setCharRangeNeedsRecoloring=function(Cs,Cr){if(Cs>=A.alltext.length){Cs=A.alltext.length-1;}if(Cr>=A.alltext.length){Cr=A.alltext.length-1;\\n}var Cu=A.lines.atOffset(Cs);var Ct=A.lines.atOffset(Cr).key;i[Ct]=true;var Cq=Cu;while(Cq&&Cq.key!=Ct){i[Cq.key]=true;\\nCq=A.lines.next(Cq);}};Cp.recolorLines=function(){for(var Cq in i){Af(Cq);}i={};};return Cp;})();var AG=(function(){var i={};\\ni.notifyTick=function(){Cr(false);};i.notifyChange=function(){Cr(true);};i.shouldNormalizeOnChar=function(Ct){if(Cq.active){return true;\\n}Ct=String.fromCharCode(Ct);return !!(Cp[Ct]);};var Cq={active:false,whichChars:null,whichLineKeys:null,expireTime:null};\\nvar Cp={"(":1,")":-1,"[":2,"]":-2,"{":3,"}":-3};var Cs=/[{}\\\\[\\\\]()]/g;function Cr(C0){function C5(C8){var C7=BI();\\nvar DA=100;var C9=3000;if(C7[0]>C8-DA){C7[0]=C8-DA;}if(C7[0]\\x3cC8-C9){C7[0]=C8-C9;}if(C7[0]\\x3c0){C7[0]=0;\\n}if(C7[1]\\x3cC8+DA){C7[1]=C8+DA;}if(C7[1]>C8+C9){C7[1]=C8+C9;}if(C7[1]>A.lines.totalWidth()){C7[1]=A.lines.totalWidth();\\n}return C7;}function C6(DH,DC){var C8=C5(DH);var DF=A.alltext.substring(C8[0],C8[1]);var DG=DF.replace(Cs,"(");\\nvar C7=DH-C8[0];var DE=[];var DA=false;var DB=false;function DI(){if(C7\\x3c0){return;}if(DC){C7++;}else{C7--;\\n}if(C7\\x3c0||C7>=DF.length){C7=-1;}if(C7>=0){if(DC){C7=DG.indexOf("(",C7);}else{C7=DG.lastIndexOf("(",C7);\\n}}}while((!DA)&&(C7>=0)){if(BH(C7+C8[0])=="p"){var DJ=Cp[DF.charAt(C7)];var DD=DC;var C9=DJ;if(C9\\x3c0){DD=!DD;\\nC9=-C9;}if(DD){DE.push(C9);}else{var DK=DE.pop();if(DK!=C9){DA=true;DB=false;}else{if(DE.length==0){DA=true;\\nDB=true;}}}}if((!DA)&&(C7>=0)){DI();}}if(!DA){return null;}return{chr:(C7+C8[0]),good:DB};}var Ct=Cq;\\nvar Cu=null;var Cw=null;if(Ct.active&&(C0||(R()>Ct.expireTime))){Cw=Ct.whichLineKeys;Ct.active=false;\\n}if((!Ct.active)&&C0&&U()&&t()>0){var Cv=A7();if(Cv>0&&BH(Cv-1)=="p"){var Cz=A.alltext.charAt(Cv-1);if(Cp[Cz]){var C2=(Cp[Cz]>0);\\nvar Cx=C6(Cv-1,C2);if(Cx){var Cy=Cx.chr;var C4=Cx.good;Ct.active=true;Cu={};Cu[Cv-1]="flash";Cu[Cy]=(C4?"flash":"flashbad");\\nCt.whichLineKeys=[];Ct.whichLineKeys.push(AL(Cv-1));Ct.whichLineKeys.push(AL(Cy));Ct.expireTime=R()+4000;\\nnewlyActive=true;}}}}if(Cw){Af(Cw[0]);Af(Cw[1]);}if(Ct.active&&Cu){function C3(C8,C7,C9,DB){var DA=Cu[DB];\\nif(C7){C9(C8,C7+" "+DA);}else{C9(C8,C7);}}for(var C1 in Cu){AU((+C1),(+C1)+1,null,C3);}}}return i;})();\\nfunction B8(){BL=true;if(H){H.never();}BF();}function BN(){return;function Cp(){throw new Error("checkALines");\\n}if(A.alines.length!=A.lines.length()){Cp();}for(var Cq=0;Cq\\x3cA.alines.length;Cq++){var Cu=A.alines[Cq];\\nvar Cv=A.lines.atIndex(Cq).text+"\\\\n";var Cw=Cv.length;var Cr=Changeset.opIterator(Cu);var Ct=0;while(Cr.hasNext()){var Cs=Cr.next();\\nCt+=Cs.chars;if(Cr.hasNext()){if(Cs.lines!=0){Cp();}}else{if(Cs.lines!=1){Cp();}}}if(Ct!=Cw){Cp();}}}function CD(i){K=i;\\nvar Cp="doesWrap";Q(B,"doesWrap",K);N.setTimeout(function(){Y("setWraps",function(){G(7);BY();h();});\\n},0);}function CK(i){var Cp=AX;AX=!!i;if(i!=Cp){if(!i){Y("setStyled",function(){G(12);var Cq=[];for(var Cr in Ac){Cq.push([Cr,""]);\\n}A2(0,A.alltext.length,Cq);});}}}function Bv(i){AQ=i;B.style.fontFamily=AQ;w.style.fontFamily=AQ;N.setTimeout(function(){AS();\\n},0);}function Bl(i){u=i;B.style.fontSize=u+"px";B.style.lineHeight=AV()+"px";T.style.lineHeight=AV()+"px";\\nw.style.fontSize=u+"px";N.setTimeout(function(){AS();},0);}function BY(){AU(0,A.alltext.length);}function BG(i){k=i;\\nif(!k){Az(false);}else{Az(true);}Q(B,"static",!k);}function Ax(){BG(k);}function CA(i,Cs,Cq){var Cp;if(Cq){if(i.charAt(i.length-1)!="\\\\n"){throw new Error("new raw text must end with newline");\\n}if(/[\\\\r\\\\t\\\\xa0]/.exec(i)){throw new Error("new raw text must not contain CR, tab, or nbsp");}Cp=i.substring(0,i.length-1).split("\\\\n");\\n}else{Cp=map(i.split("\\\\n"),CH);}var Cr="\\\\n";if(Cp.length>0){Cr=Cp.join("\\\\n")+"\\\\n";}Y("importText"+(Cs?"Undoable":""),function(){Bb(Cr);\\n});if(Cq&&A.alltext!=i){throw new Error("mismatch error setting raw text in importText");}}function B9(i,Cp,Cr){i=Changeset.cloneAText(i);\\nif(Cp){var Cq=(new AttribPool()).fromJsonable(Cp);i.attribs=Changeset.moveOpsToNewPool(i.attribs,Cq,A.apool);\\n}Y("importText"+(Cr?"Undoable":""),function(){Aa(i);});}function Aa(Cq){G(8);var Cs=A.lines.totalWidth();\\nvar Cr=A.lines.length();var Cu=A.lines.offsetOfIndex(Cr-1);var Ct=A.lines.atIndex(Cr-1).text.length;var Cp=Changeset.smartOpAssembler();\\nvar i=Changeset.newOp("-");i.chars=Cu;i.lines=Cr-1;Cp.append(i);i.chars=Ct;i.lines=0;Cp.append(i);Changeset.appendATextToAssembler(Cq,Cp);\\nvar Cv=Cs+Cp.getLengthChange();var Cw=Changeset.checkRep(Changeset.pack(Cs,Cv,Cp.toString(),Cq.text.slice(0,-1)));\\nb(Cw);d([0,A.lines.atIndex(0).lineMarker],[0,A.lines.atIndex(0).lineMarker]);H.atMost(100);if(A.alltext!=Cq.text){v(htmlPrettyEscape(A.alltext));\\nv(htmlPrettyEscape(Cq.text));throw new Error("mismatch error setting raw text in setDocAText");}}function Bb(i){Aa(Changeset.makeAText(i));\\n}function CW(){var Cp=A.alltext;var i=Cp.length;if(i>0){i--;}return Cp.substring(0,i);}function CL(){if(C&&!C.domClean){Y("exportText",function(){G(2);\\n});}return CW();}function B7(){h();}function Bn(i){Ar=i;}function Bq(i){Au=i;}function Bp(i){An=i;}function Bm(){if(C&&!C.domClean){Y("getFormattedCode",q);\\n}var Cp=[];if(A.lines.length()>0){var i=A.lines.atIndex(0);while(i){var Cq=i.domInfo;Cp.push((Cq&&Cq.getInnerHTML())||domline.processSpaces(domline.escapeHTML(i.text),K)||"&nbsp;");\\ni=A.lines.next(i);}}return\\\'\\x3cdiv class="syntax">\\x3cdiv>\\\'+Cp.join("\\x3c/div>\\\\n\\x3cdiv>")+"\\x3c/div>\\x3c/div>";}var AZ={bold:function(){c("bold");\\n},italic:function(){c("italic");},underline:function(){c("underline");},strikethrough:function(){c("strikethrough");\\n},undo:function(){s("undo");},redo:function(){s("redo");},clearauthorship:function(i){if((!(A.selStart&&A.selEnd))||U()){if(i){i();\\n}else{A2(0,A.alltext.length,[["author",""]]);}}else{Bi("author","");}},insertunorderedlist:As,indent:function(){if(!AT(false)){As();\\n}},outdent:function(){AT(true);}};function CR(i){i=i.toLowerCase();var Cp=Array.prototype.slice.call(arguments,1);\\nif(AZ[i]){a(i,function(){G(9);AZ[i].apply(AZ,Cp);});}}D.ace_focus=Bc;D.ace_importText=CA;D.ace_importAText=B9;\\nD.ace_exportText=CL;D.ace_editorChangedSize=B7;D.ace_setOnKeyPress=Bn;D.ace_setOnKeyDown=Bq;D.ace_setNotifyDirty=Bp;\\nD.ace_dispose=B8;D.ace_getFormattedCode=Bm;D.ace_setEditable=BG;D.ace_execCommand=CR;D.ace_setProperty=function(Cq,i){var Cp=Cq.toLowerCase();\\nif(Cp=="wraps"){CD(i);}else{if(Cp=="showsauthorcolors"){Q(B,"authorColors",!!i);}else{if(Cp=="showsuserselections"){Q(B,"userSelections",!!i);\\n}else{if(Cp=="showslinenumbers"){AP=!!i;Q(T,"sidedivhidden",!AP);h();}else{if(Cp=="grayedout"){Q(F.document.body,"grayedout",!!i);\\n}else{if(Cp=="dmesg"){v=i;window.dmesg=i;}else{if(Cp=="userauthor"){e=String(i);}else{if(Cp=="styled"){CK(i);\\n}else{if(Cp=="textface"){Bv(i);}else{if(Cp=="textsize"){Bl(i);}}}}}}}}}}};D.ace_setBaseText=function(i){M.setBaseText(i);\\n};D.ace_setBaseAttributedText=function(Cp,i){AS();M.setBaseAttributedText(Cp,i);};D.ace_applyChangesToBase=function(Cq,i,Cp){M.applyChangesToBase(Cq,i,Cp);\\n};D.ace_prepareUserChangeset=function(){return M.prepareUserChangeset();};D.ace_applyPreparedChangesetToBase=function(){M.applyPreparedChangesetToBase();\\n};D.ace_setUserChangeNotificationCallback=function(i){M.setUserChangeNotificationCallback(i);};D.ace_setAuthorInfo=function(i,Cp){CV(i,Cp);\\n};D.ace_setAuthorSelectionRange=function(Cp,Cq,i){M.setAuthorSelectionRange(Cp,Cq,i);};D.ace_getUnhandledErrors=function(){return BU.slice();\\n};D.ace_getDebugProperty=function(i){if(i=="debugger"){window["eval"]("debugger");}else{if(i=="rep"){return A;\\n}else{if(i=="window"){return window;}else{if(i=="document"){return document;}}}}return undefined;};function R(){return(new Date()).getTime();\\n}function AC(Cs){var Cq=R();var Ct=0;var i=false;var Cr=false;var Cp=function(){if(i){if((!Cr)){Cr=true;\\n}return true;}var Cu=R()-Cq;if(Cu>Cs){i=true;return true;}else{Ct=Cu;return false;}};Cp.elapsed=function(){return R()-Cq;\\n};return Cp;}function CZ(Cs){var i=null;var Cp=0;function Cr(){if(i){N.clearTimeout(i);i=null;}}function Cq(Cv){Cr();\\nCp=Cv;var Cu=Cv-R();if(Cu\\x3c0){Cu=0;}i=N.setTimeout(Ct,Cu);}function Ct(){i=null;Cs();}return{atMost:function(Cv){var Cu=R()+Cv;\\nif((!i)||Cp>Cu){Cq(Cu);}},atLeast:function(Cv){var Cu=R()+Cv;if((!i)||Cp\\x3cCu){Cq(Cu);}},never:function(){Cr();\\n}};}function G(i){q(AC(0));}function A8(){var i=A8;var Cr=(i.failures||0);if(Cr\\x3c5){var Cq=AC(40);var Cs=q(Cq);\\nif(Cq()){i.failures=Cr+1;}return true;}else{var Cp=(i.skipCount||0);Cp++;if(Cp==20){Cp=0;i.failures=0;\\n}i.skipCount=Cp;}return false;}var H=CZ(function(){if(!k){return;}if(r){H.atLeast(500);return;}a("idleWorkTimer",function(){var i=AC(250);\\nvar Cq=false;var Cr=false;try{q(i);if(i()){return;}CN();if(i()){return;}var Ct=BI();var Cs=[0,A.lines.totalWidth()];\\nCq=true;Cr=true;}finally{if(Cr){H.atMost(1000);}else{if(Cq){H.atMost(500);}else{var Cp=Math.round(i.elapsed()/2);\\nif(Cp\\x3c100){Cp=100;}H.atMost(Cp);}}}});});var B1=1;function L(Cp){var i=Cp.id;if(i){return i;}return(Cp.id="magicdomid"+(B1++));\\n}function AU(Cr,Cx,Cs,Cv){if(Cx\\x3c=Cr){return;}if(Cr\\x3c0||Cr>=A.lines.totalWidth()){return;}var i=A.lines.atOffset(Cr);\\nvar Cp=A.lines.offsetOfEntry(i);var Cq=A.lines.indexOfEntry(i);var Cw=false;var Cy=null;var C1=null;Cs=(Cs||I);\\nvar Cu;var Ct=function(C2,C3){i.domInfo.appendSpan(C2,C3);};if(Cv){var C0=Ct;Ct=function(C2,C3){Cv(C2,C3,C0,Cu);\\nCu+=C2.length;};}while(i&&Cp\\x3cCx&&!Cs()){var Cz=Cp+i.width;Cu=Cp;i.domInfo.clearSpans();BJ(i,Ct,Cp);i.domInfo.finishUpdate();\\nz(i.lineNode);if(A.selStart&&A.selStart[0]==Cq||A.selEnd&&A.selEnd[0]==Cq){Cw=true;}if(Cy===null){Cy=Cq;\\n}C1=Cq;Cp=Cz;i=A.lines.next(i);Cq++;}if(Cw){C.selectionAffected=true;}}function BJ(Cq,Cs,Cw){var Cr=Cw;\\nif((typeof Cr)!="number"){Cr=A.lines.offsetOfEntry(Cq);}var Cp=Cq.text;var Cx=Cq.width;if(Cp.length==0){var Ct=linestylefilter.getLineStyleFilter(0,"",Cs,A.apool);\\nCt("","");}else{var Cy=0;var i=Cs;i=linestylefilter.getURLFilter(Cp,i);if(browser.msie){i=linestylefilter.getAtSignSplitterFilter(Cp,i);\\n}var Cu=A.lines.indexOfEntry(Cq);var Cv=A.alines[Cu];i=linestylefilter.getLineStyleFilter(Cp.length,Cv,i,A.apool);\\ni(Cp,"");}}function BH(i){return"";}var AE;function A4(){AE={cleanNodesNearChanges:{}};}A4();function l(Cq){var i=O("getCleanNodeByKey",false);\\ni.extra=0;var Cp=E.getElementById(Cq);while(Cp&&V(Cp)){i.extra++;Cp.id="";Cp=E.getElementById(Cq);}i.literal(i.extra,"extra");\\ni.end();return Cp;}function y(Cs){var i;var Cu;if(!V(Cs)){i=Cs;var Ct=i.previousSibling;var Cr=i.nextSibling;\\nCu=((Ct&&V(Ct))||(Cr&&V(Cr)));}else{var Cp=Cs.previousSibling;while(Cp&&V(Cp)){Cp=Cp.previousSibling;\\n}if(Cp){i=Cp;}else{var Cq=Cs.nextSibling;while(Cq&&V(Cq)){Cq=Cq.nextSibling;}if(Cq){i=Cq;}}if(!i){return;\\n}Cu=true;}if(Cu){AE.cleanNodesNearChanges["$"+L(i)]=true;}else{var Cx=L(i);var Ct=i.previousSibling;var Cr=i.nextSibling;\\nvar C1=((Ct&&L(Ct))||null);var C0=((Cr&&L(Cr))||null);var Cv=A.lines.prev(A.lines.atKey(Cx));var Cw=A.lines.next(A.lines.atKey(Cx));\\nvar Cz=((Cv&&Cv.key)||null);var Cy=((Cw&&Cw.key)||null);if(C1!=Cz||C0!=Cy){AE.cleanNodesNearChanges["$"+L(i)]=true;\\n}}}function Aw(){if(C.observedSelection){return;}C.observedSelection=true;var Cs=O("getSelection",false);\\nvar Cq=Ae();Cs.end();if(Cq){function Cr(Ct){if((!Ct)||Ct==B){return null;}while(Ct.parentNode!=B){Ct=Ct.parentNode;\\n}return Ct;}var Cp=Cr(Cq.startPoint.node);var i=Cr(Cq.endPoint.node);if(Cp){y(Cp);}if(i&&Cp!=i){y(i);\\n}}}function BV(){if(B.getElementsByTagName){var Cr=B.getElementsByTagName("style");for(var Cq=0;Cq\\x3cCr.length;\\nCq++){var Cp=Cr[Cq];while(Cp.parentNode&&Cp.parentNode!=B){Cp=Cp.parentNode;}if(Cp.parentNode==B){y(Cp);\\n}}}}function q(C9){if(C.domClean){return false;}r=false;C.isUserChange=true;C9=(C9||function(){return false;\\n});if(AK&&top.DONT_INCORP||window.DEBUG_DONT_INCORP){return false;}var Cq=O("incorp",false);if(!B.firstChild){B.innerHTML="\\x3cdiv>\\x3c!-- -->\\x3c/div>";\\n}Cq.mark("obs");Aw();BV();Cq.mark("dirty");var Cy=BK();var DN=true;var C5=0;var Cp,Ct;while(C5\\x3cCy.length){Cp=Cy[C5][0];\\nCt=Cy[C5][1];if(!((Cp==0||l(A.lines.atIndex(Cp-1).key))&&(Ct==A.lines.length()||l(A.lines.atIndex(Ct).key)))){DN=false;\\nbreak;}C5++;}if(!DN){var DS=B.childNodes.length;for(var C0=0;C0\\x3cDS;C0++){var C7=B.childNodes.item(C0);\\nif((C7.tagName)&&((!C7.id)||(!A.lines.containsKey(C7.id)))){y(C7);}}Cy=BK();}A4();Cq.mark("getsel");var Cv=Ae();\\nvar Cs,Cr;var DE=0;var C6=[];var C3=0;var C8=[];Cq.mark("ranges");Cq.literal(Cy.length,"numdirt");var DI=[];\\nwhile(DE\\x3cCy.length){var DG=Cy[DE];Cp=DG[0];Ct=DG[1];var C1=(((Cp==0)&&B.firstChild)||l(A.lines.atIndex(Cp-1).key).nextSibling);\\nC1=(C1&&V(C1)&&C1);var Cu=(((Ct==A.lines.length())&&B.lastChild)||l(A.lines.atIndex(Ct).key).previousSibling);\\nCu=(Cu&&V(Cu)&&Cu);if(C1&&Cu){var Cz=makeContentCollector(AX,browser,A.apool,null,Bd);Cz.notifySelection(Cv);\\nvar DJ=[];for(var Cx=C1;Cx&&!(Cx.previousSibling&&Cx.previousSibling==Cu);Cx=Cx.nextSibling){if(browser.msie){try{Cx.createTextRange().execCommand("unlink",false,null);\\n}catch(DR){}}Cz.collectContent(Cx);DJ.push(Cx);}Cz.notifyNextNode(Cu.nextSibling);var Cw=Cz.getLines();\\nif((Cw.length\\x3c=1||Cw[Cw.length-1]!=="")&&Cu.nextSibling){Ct++;var DF=Cu.nextSibling;Cz.collectContent(DF);\\nC8.push(DF);Cz.notifyNextNode(DF.nextSibling);}var C2=Cz.finish();var DA=C2.selStart;var DB=C2.selEnd;\\nCw=C2.lines;var DP=C2.lineAttribs;var DC=C2.linesWrapped;if(DC>0){By("Editor warning: "+DC+" long line"+(DC==1?" was":"s were")+" hard-wrapped into "+C2.numLinesAfter+" lines.");\\n}if(DA[0]>=0){Cs=[DA[0]+Cp+C3,DA[1]];}if(DB[0]>=0){Cr=[DB[0]+Cp+C3,DB[1]];}var DL=[];var DO=Cu;var DH=new Array(Cw.length);\\nfor(var C0=0;C0\\x3cCw.length;C0++){var DQ=Cw[C0];var DK=AN(DQ);DL.push(DK);DH[C0]=DK.domInfo;}DI.push([DO,DH]);\\nforEach(DJ,function(i){C8.push(i);});var DD={};if(Cs){DD.selStart=Cs;}if(Cr){DD.selEnd=Cr;}C6.push([Cp+C3,Ct-Cp,DL,DP,DD]);\\nC3+=(Cw.length-(Ct-Cp));}else{if(Ct>Cp){C6.push([Cp+C3,Ct-Cp,[],[]]);}}DE++;}var DM=(C6.length>0);Cq.mark("splice");\\nforEach(C6,function(i){CI(i[0],i[1],i[2],i[3],i[4]);});Cq.mark("insert");forEach(DI,function(i){AH(i[0],i[1],C9);\\n});Cq.mark("del");forEach(C8,function(i){i.parentNode.removeChild(i);});Cq.mark("findsel");if(Cv&&!Cs){Cs=Aq(Cv.startPoint);\\n}if(Cv&&!Cr){Cr=Aq(Cv.endPoint);}var C4=A.lines.length();if(Cs&&Cs[0]>=C4){Cs[0]=C4-1;Cs[1]=A.lines.atIndex(Cs[0]).text.length;\\n}if(Cr&&Cr[0]>=C4){Cr[0]=C4-1;Cr[1]=A.lines.atIndex(Cr[0]).text.length;}Cq.mark("repsel");BR(Cs,Cr,Cv&&Cv.focusAtStart);\\nCq.mark("browsel");if(Cv&&(DM||U())){C.selectionAffected=true;}C.domClean=true;Cq.mark("fixview");h();\\nCq.end("END");return DM;}function Cc(Cp){var i=E.createElement("DIV");i.appendChild(Cp);return i.innerHTML;\\n}var Ac={bold:true,italic:true,underline:true,strikethrough:true,list:true};var CF={insertorder:true,author:true};\\nfunction A0(i){return !!Ac[i];}function Ck(i){return(!!Ac[i])||(!!CF[i]);}function AH(Cq,i,Cr){Cr=(Cr||function(){return false;\\n});var Cp;var Cs;if(i.length\\x3c1){return;}var Cu=A.lines.atKey(L(i[0].node));var Ct=A.lines.atKey(L(i[i.length-1].node));\\nvar Cv=A.lines.offsetOfEntry(Cu);var Cw=A.lines.offsetOfEntry(Ct)+Ct.width;forEach(i,function(C0){var Cx=O("insertLine",false);\\nvar Cz=C0.node;var C1=L(Cz);var Cy;Cx.mark("findEntry");if(Cp){var C2=A.lines.next(Cp);if(C2&&C2.key==C1){Cy=C2;\\nCs+=Cp.width;}}if(!Cy){Cx.literal(1,"nonopt");Cy=A.lines.atKey(C1);Cs=A.lines.offsetOfKey(C1);}else{Cx.literal(0,"nonopt");\\n}Cp=Cy;Cx.mark("spans");BJ(Cy,function(C3,C4){C0.appendSpan(C3,C4);},Cs,Cr());Cx.mark("addLine");C0.prepareForAdd();\\nCy.lineMarker=C0.lineMarker;if(!Cq){B.insertBefore(Cz,B.firstChild);}else{B.insertBefore(Cz,Cq.nextSibling);\\n}Cq=Cz;C0.notifyAdded();Cx.mark("markClean");z(Cz);Cx.end();});}function U(){return(A.selStart&&A.selEnd&&A.selStart[0]==A.selEnd[0]&&A.selStart[1]==A.selEnd[1]);\\n}function m(){return A.selStart[0];}function t(){return A.selStart[1];}function A7(){return A.lines.offsetOfIndex(m())+t();\\n}function CE(){if(U()&&t()==0&&m()>0){var i=m();var Ct=A.lines.atIndex(i);var Cs=A.lines.prev(Ct);var Cq=Cs.text;\\nvar Cp=/^ *(?:)/.exec(Cq)[0];if(/[\\\\[\\\\(\\\\{]\\\\s*$/.exec(Cq)){Cp+=Ad;}var Cr=Changeset.builder(A.lines.totalWidth()).keep(A.lines.offsetOfIndex(i),i).insert(Cp,[["author",e]],A.apool).toString();\\nb(Cr);d([i,Cp.length],[i,Cp.length]);}}function Bk(Cr){var Cq=A.lines.atIndex(Cr).lineNode;var i=Cq.firstChild;\\nwhile(AF(i)&&i.firstChild){i=i.firstChild;}var Cp;if(isNodeText(i)){i.nodeValue=" "+i.nodeValue;Cp=i;\\n}else{Cp=E.createTextNode(" ");i.parentNode.insertBefore(Cp,i);}z(Cq);return{unhack:function(){if(Cp.nodeValue==" "){Cp.parentNode.removeChild(Cp);\\n}else{Cp.nodeValue=Cp.nodeValue.substring(1);}z(Cq);}};}function Am(Cv){var Cw=Cv[0];var Cp=Cv[1];var Ct=A.lines.atIndex(Cw);\\nCp-=Ct.lineMarker;if(Cp\\x3c0){Cp=0;}var Cr=Ct.lineNode;var i=Cr;var Cq=false;if(Cp==0){var Cu=0;if(browser.msie&&Cw==(A.lines.length()-1)&&Cr.childNodes.length==0){Cu=1;\\n}return{node:Cr,index:Cu,maxIndex:1};}while(!(i==Cr&&Cq)){if(Cq){if(i.nextSibling){i=i.nextSibling;Cq=false;\\n}else{i=i.parentNode;}}else{if(isNodeText(i)){var Cs=i.nodeValue.length;if(Cp\\x3c=Cs){return{node:i,index:Cp,maxIndex:Cs};\\n}Cp-=Cs;Cq=true;}else{if(i.firstChild){i=i.firstChild;}else{Cq=true;}}}}return{node:Cr,index:1,maxIndex:1};\\n}function BD(i){return i.innerText||i.textContent||i.nodeValue||"";}function Aq(Cq){if(Cq.node==B){if(Cq.index==0){return[0,0];\\n}else{var Ct=A.lines.length();var Cw=A.lines.atIndex(Ct-1);return[Ct-1,Cw.text.length];}}else{var i=Cq.node;\\nvar Cp=0;if(isNodeText(i)){Cp=Cq.index;}else{if(Cq.index>0){Cp=BD(i).length;}}var Cr,Cs;while((Cr=i.parentNode)!=B){if((Cs=i.previousSibling)){i=Cs;\\nCp+=BD(i).length;}else{i=Cr;}}if(i.id==""){S.debug("BAD");}if(i.firstChild&&AF(i.firstChild)){Cp+=1;}var Cu=A.lines.atKey(i.id);\\nvar Cv=A.lines.indexOfEntry(Cu);return[Cv,Cp];}}function AN(Cq){var Cp=CS(Cq.length>0);var i=Cp.node;\\nreturn{key:L(i),text:Cq,lineNode:i,domInfo:Cp,lineMarker:0};}function Co(i){return Changeset.oldLen(i)==A.alltext.length;\\n}function b(Cp,Cr){Ap(Cp,Cr);var i=null;if(A.selStart&&A.selEnd){var Cv=A.lines.offsetOfIndex(A.selStart[0])+A.selStart[1];\\nvar Cs=A.lines.offsetOfIndex(A.selEnd[0])+A.selEnd[1];var Cq=Changeset.characterRangeFollow(Cp,Cv,Cs,Cr);\\ni=[Cq[0],Cq[1],A.selFocusAtStart];}var Cu={splice:function(Cx,Cw,Cy){Ct(Cx,Cw,map(Array.prototype.slice.call(arguments,2),function(Cz){return Cz.slice(0,-1);\\n}),null);},get:function(Cw){return A.lines.atIndex(Cw).text+"\\\\n";},length:function(){return A.lines.length();\\n},slice_notused:function(Cx,Cw){return map(A.lines.slice(Cx,Cw),function(Cy){return Cy.text+"\\\\n";});}};\\nChangeset.mutateTextLines(Cp,Cu);BN();if(i){d(P(i[0]),P(i[1]),i[2]);}function Ct(Cw,Cx,C4,Cz){Cz=(Cz||AC(50));\\nvar C1=[];if(Cx>0){var C0=A.lines.atIndex(Cw);for(var C3=0;C3\\x3cCx;C3++){C1.push(C0.key);C0=A.lines.next(C0);\\n}}var C2=map(C4,AN);AJ(Cw,Cx,C2);var Cy;if(Cw>0){Cy=l(A.lines.atIndex(Cw-1).key);}else{Cy=null;}AH(Cy,map(C2,function(C5){return C5.domInfo;\\n}),Cz);forEach(C1,function(C6){var C5=E.getElementById(C6);C5.parentNode.removeChild(C5);});if((A.selStart&&A.selStart[0]>=Cw&&A.selStart[0]\\x3c=Cw+Cx)||(A.selEnd&&A.selEnd[0]>=Cw&&A.selEnd[0]\\x3c=Cw+Cx)){C.selectionAffected=true;\\n}}}function Bz(Cw){return true;var Cs=Changeset.opIterator(Changeset.unpack(Cw).ops);var Cp=0;var Cr=0;\\nvar Cq=0;while(Cs.hasNext()){var i=Cs.next();if(i.opcode=="-"||i.opcode=="="){Cp+=i.chars;if(i.lines){Cr+=i.lines;\\nCq=0;}else{Cq+=i.chars;}}var Ct=A.lines.indexOfOffset(Cp);var Cv=A.lines.offsetOfIndex(Ct);var Cu=Cp-Cv;\\nif(Cu!=Cq||Ct!=Cr){return false;}}return true;}function Ap(i,Cq){Changeset.checkRep(i);if(Changeset.oldLen(i)!=A.alltext.length){throw new Error("doRepApplyChangeset length mismatch: "+Changeset.oldLen(i)+"/"+A.alltext.length);\\n}if(!Bz(i)){throw new Error("doRepApplyChangeset line break mismatch");}(function Cp(Cs){var Cr=C.editEvent;\\nif(Cr.eventType=="nonundoable"){if(!Cr.changeset){Cr.changeset=Cs;}else{Cr.changeset=Changeset.compose(Cr.changeset,Cs,A.apool);\\n}}else{var Ct=Changeset.inverse(Cs,{get:function(Cu){return A.lines.atIndex(Cu).text+"\\\\n";},length:function(){return A.lines.length();\\n}},A.alines,A.apool);if(!Cr.backset){Cr.backset=Ct;}else{Cr.backset=Changeset.compose(Ct,Cr.backset,A.apool);\\n}}})(i);Changeset.mutateAttributionLines(i,A.alines,A.apool);if(M.isTracking()){M.composeUserChangeset(i);\\n}}function P(i){var Cp=A.lines.atOffset(i);var Cq=A.lines.offsetOfEntry(Cp);var Cr=A.lines.indexOfEntry(Cp);\\nreturn[Cr,i-Cq];}function BA(Cq,Cp,i){if(Cq==Cp&&i.length==0){return;}if(Cp==A.alltext.length){if(Cq==Cp){Cq--;\\nCp--;i="\\\\n"+i.substring(0,i.length-1);}else{if(i.length==0){Cq--;Cp--;}else{Cp--;i=i.substring(0,i.length-1);\\n}}}f(P(Cq),P(Cp),i);}function f(Cp,Cq,Cs){var i=Changeset.builder(A.lines.totalWidth());At(i,Cp);BQ(i,Cp,Cq);\\ni.insert(Cs,[["author",e]],A.apool);var Cr=i.toString();b(Cr);}function A2(Cq,i,Cp){if(i>=A.alltext.length){i=A.alltext.length-1;\\n}AB(P(Cq),P(i),Cp);}function AB(Cp,Cq,Cs){var i=Changeset.builder(A.lines.totalWidth());At(i,Cp);AR(i,Cp,Cq,Cs,A.apool);\\nvar Cr=i.toString();b(Cr);}function At(Cp,i){var Cq=A.lines.offsetOfIndex(i[0]);Cp.keep(Cq,i[0]);Cp.keep(i[1]);\\n}function BQ(Cq,Cp,i){var Cs=A.lines.offsetOfIndex(Cp[0]);var Cr=A.lines.offsetOfIndex(i[0]);if(i[0]>Cp[0]){Cq.remove(Cr-Cs-Cp[1],i[0]-Cp[0]);\\nCq.remove(i[1]);}else{Cq.remove(i[1]-Cp[1]);}}function AR(Cq,Cp,i,Cs,Cr){var Cu=A.lines.offsetOfIndex(Cp[0]);\\nvar Ct=A.lines.offsetOfIndex(i[0]);if(i[0]>Cp[0]){Cq.keep(Ct-Cu-Cp[1],i[0]-Cp[0],Cs,Cr);Cq.keep(i[1],0,Cs,Cr);\\n}else{Cq.keep(i[1]-Cp[1],0,Cs,Cr);}}function Bi(i,Cp){if(!(A.selStart&&A.selEnd)){return;}AB(A.selStart,A.selEnd,[[i,Cp]]);\\n}function c(Cq){if(!(A.selStart&&A.selEnd)){return;}var Cp=true;var C1=Changeset.makeAttribsString("+",[[Cq,"true"]],A.apool);\\nvar C2=new RegExp(C1.replace(/\\\\*/g,"\\\\\\\\*")+"(\\\\\\\\*|$)");function C0(C3){return C2.test(C3);}var Cx=A.selStart[0];\\nvar Cu=A.selEnd[0];for(var i=Cx;i\\x3c=Cu;i++){var Cs=Changeset.opIterator(A.alines[i]);var Cz=0;var Cw=0;\\nvar Cr=A.lines.atIndex(i).text.length;if(i==Cx){Cw=A.selStart[1];}if(i==Cu){Cr=A.selEnd[1];}while(Cs.hasNext()){var Cv=Cs.next();\\nvar Cy=Cz;var Ct=Cy+Cv.chars;if(!C0(Cv.attribs)){if(!(Ct\\x3c=Cw||Cy>=Cr)){Cp=false;break;}}Cz=Ct;}if(!Cp){break;\\n}}if(Cp){AB(A.selStart,A.selEnd,[[Cq,""]]);}else{AB(A.selStart,A.selEnd,[[Cq,"true"]]);}}function AY(i){if(!(A.selStart&&A.selEnd)){return;\\n}f(A.selStart,A.selEnd,i);}function AJ(i,Cq,Cp){forEach(Cp,function(Cx){Cx.width=Cx.text.length+1;});\\nvar Cs=A.lines.offsetOfIndex(i);var Ct=A.lines.offsetOfIndex(i+Cq);var Cu=A.lines.offsetOfIndex(i);var Cw=A.lines.offsetOfIndex(i+Cq);\\nA.lines.splice(i,Cq,Cp);C.docTextChanged=true;C.repChanged=true;var Cv=A.lines.offsetOfIndex(i+Cp.length);\\nvar Cr=map(Cp,function(Cx){return Cx.text+"\\\\n";}).join("");A.alltext=A.alltext.substring(0,Cs)+Cr+A.alltext.substring(Ct,A.alltext.length);\\n}function CI(Cv,C6,DE,DO,Cr){var DF=A.lines.offsetOfIndex(Cv);var DK=A.lines.offsetOfIndex(Cv+C6);var DJ=A.lines.offsetOfIndex(Cv);\\nvar DI,DM;if(Cr&&Cr.selStart){DI=A.lines.offsetOfIndex(Cr.selStart[0])+Cr.selStart[1]-DJ;}if(Cr&&Cr.selEnd){DM=A.lines.offsetOfIndex(Cr.selEnd[0])+Cr.selEnd[1]-DJ;\\n}var Cs=map(DE,function(DU){return DU.text+"\\\\n";}).join("");var C1=A.alltext.substring(DF,DK);var DG=A.alines.slice(Cv,Cv+C6).join("");\\nvar C0=DO.join("|1+1")+"|1+1";var DC=B6(C1,Cs,DG,C0,DI,DM);var Cz=DC[0];var Cx=DC[1];var Cq=C1.substring(Cz,C1.length-Cx);\\nvar i=Cs.substring(Cz,Cs.length-Cx);var Cp=DF+Cz;var Ct=DK-Cx;var Cw=false;if(Cq.charAt(Cq.length-1)=="\\\\n"&&i.charAt(i.length-1)=="\\\\n"){Cq=Cq.slice(0,-1);\\ni=i.slice(0,-1);Ct--;Cx++;}if(Cq.length==0&&Cp==A.alltext.length&&i.length>0){Cp--;Ct--;i="\\\\n"+i.slice(0,-1);\\nCw=true;}if(Ct==A.alltext.length&&Cq.length>0&&i.length==0){if(A.alltext.charAt(Cp-1)=="\\\\n"){Cp--;Ct--;\\n}}if(!(Cq.length==0&&i.length==0)){var DR=A.alltext;var DT=DR.length;var C4=A.lines.indexOfOffset(Cp);\\nvar DA=A.lines.offsetOfIndex(C4);function C8(){var DU=Changeset.builder(DT);DU.keep(DA,C4);DU.keep(Cp-DA);\\nreturn DU;}function Cy(Db,Da){var DW=Changeset.opIterator(Db);var DU=0;var DX=Cz;var DZ=Cs.length-Cx-(Cw?1:0);\\nwhile(DW.hasNext()){var DY=DW.next();var DV=DU+DY.chars;if(!(DV\\x3c=DX||DU>=DZ)){Da(Math.max(DX,DU),Math.min(DZ,DV),DY.attribs);\\n}DU=DV;}}var DP=(i==Cq);var C5;if(DP){var DN=BT(function(DU){return Changeset.mapAttribNumbers(DU,function(DW){var DV=A.apool.getAttribKey(DW);\\nif(A0(DV)){return A.apool.putAttrib([DV,""]);}return false;});});var C3=C8();if(Cw){C3.keep(1,1);}Cy(DG,function(DW,DU,DV){C3.keepText(Cs.substring(DW,DU),DN(DV));\\n});var DS=C3.toString();var C2=C8();if(Cw){C2.keep(1,1);}Cy(C0,function(DW,DU,DV){C2.keepText(Cs.substring(DW,DU),DV);\\n});var DQ=C2.toString();C5=Changeset.compose(DS,DQ,A.apool);}else{var Cu=C8();var DH=A.lines.indexOfOffset(Ct);\\nvar C9=A.lines.offsetOfIndex(DH);if(C9>Cp){Cu.remove(C9-Cp,DH-C4);Cu.remove(Ct-C9);}else{Cu.remove(Ct-Cp);\\n}var DL=false;var DD=Changeset.makeAttribsString("+",(e?[["author",e]]:[]),A.apool);var DB=BT(function(DU){if(DL){return Changeset.composeAttributes(DD,DU,true,A.apool);\\n}else{return Changeset.composeAttributes(DU,DD,true,A.apool);}});var C7="";Cy(C0,function(DX,DW,DV){var DU=Changeset.attribsAttributeValue(DV,"author",A.apool);\\nif(DU&&DU!=C7){if(!C7){C7=DU;}else{DL=true;}}});if(Cw){Cu.insert("\\\\n",DB(""));}Cy(C0,function(DW,DU,DV){Cu.insert(Cs.substring(DW,DU),DB(DV));\\n});C5=Cu.toString();}Ap(C5);}AJ(Cv,C6,DE);BN();}function BT(Cp){var i={};return function(Cq){if(!i[Cq]){i[Cq]=Cp(Cq);\\n}return i[Cq];};}function B6(Cv,Cw,C6,C7,DA,Cx){function Cy(DB){return A0(A.apool.getAttribKey(DB));}function C5(DF){var DC=[];\\nvar DE=[];var DB=Changeset.opIterator(DF);while(DB.hasNext()){var DD=DB.next();DC.push(DD.chars);DE.push(DD.attribs);\\n}return[DC,DE];}function Ct(DF,DE){var DD=DF[0];var DG=DF[1];var DB=(DE?DD.length-1:0);var DC=0;return function DH(){while(DC>=DD[DB]){if(DE){DB--;\\n}else{DB++;}DC=0;}var DI=DG[DB];DC++;return DI;};}var Cs=Cv.length;var Cr=Cw.length;var C2=Math.min(Cs,Cr);\\nvar C3=C5(Changeset.filterAttribNumbers(C6,Cy));var C1=C5(Changeset.filterAttribNumbers(C7,Cy));var Cp=0;\\nvar C9=Ct(C3,false);var C8=Ct(C1,false);while(Cp\\x3cC2){if(Cv.charAt(Cp)==Cw.charAt(Cp)&&C9()==C8()){Cp++;\\n}else{break;}}var i=0;var C0=Ct(C3,true);var C4=Ct(C1,true);while(i\\x3cC2){if(i==0){C0();C4();i++;}else{if(Cv.charAt(Cs-1-i)==Cw.charAt(Cr-1-i)&&C0()==C4()){i++;\\n}else{break;}}}var Cq=-1;if((typeof Cx)=="number"){Cq=Cr-Cx;}if(Cp+i>Cs){var Cu=Cs-Cp;var Cz=i;if(Cq>=Cu&&Cq\\x3c=Cz){i=Cq;\\n}else{i=Cu;}Cp=Cs-i;}if(Cp+i>Cr){var Cu=Cr-Cp;var Cz=i;if(Cq>=Cu&&Cq\\x3c=Cz){i=Cq;}else{i=Cu;}Cp=Cr-i;}return[Cp,i];\\n}function A3(Cp,i){if(!Cp){return !i;}if(!i){return !Cp;}return(Cp[0]==i[0]&&Cp[1]==i[1]);}function d(Cq,i,Cp){if(BR(Cq,i,Cp)){C.selectionAffected=true;\\n}}function BR(Cp,i,Cq){Cq=!!Cq;var Cr=(Cq&&((!Cp)||(!i)||(Cp[0]!=i[0])||(Cp[1]!=i[1])));if((!A3(A.selStart,Cp))||(!A3(A.selEnd,i))||(A.selFocusAtStart!=Cr)){A.selStart=Cp;\\nA.selEnd=i;A.selFocusAtStart=Cr;if(AA){AA.notifySelectionChanged();}C.repChanged=true;return true;}return false;\\n}function CS(Cs){if(browser.msie&&(!Cs)){var i={node:null,appendSpan:I,prepareForAdd:I,notifyAdded:I,clearSpans:I,finishUpdate:I,lineMarker:0};\\nvar Cq=E.createElement("div");i.node=Cq;i.notifyAdded=function(){Cq.innerHTML="";setAssoc(Cq,"shouldBeEmpty",true);\\nsetAssoc(Cq,"unpasted",{});};var Cp="ace-line";i.appendSpan=function(Cu,Ct){if((!Cu)&&Ct){Cp=domline.addToLineClass(Cp,Ct);\\n}};i.clearSpans=function(){Cp="";};function Cr(){if(Cp!==null){Cq.className=Cp;}}i.prepareForAdd=Cr;i.finishUpdate=Cr;\\ni.getInnerHTML=function(){return"";};return i;}else{return domline.createDomLine(Cs,K,browser,E);}}function CH(i){return i.replace(/[\\\\n\\\\r ]/g," ").replace(/\\\\xa0/g," ").replace(/\\\\t/g,"        ");\\n}var Br={div:1,p:1,pre:1,li:1,ol:1,ul:1};function AF(i){return !!Br[(i.tagName||"").toLowerCase()];}function BK(){var i=O("getDirtyRanges",false);\\ni.forIndices=0;i.consecutives=0;i.corrections=0;var Cs={};var Cq=A.lines.length();function Cu(C7){if(Cs[C7]===undefined){i.forIndices++;\\nvar C8;if(C7\\x3c0||C7>=Cq){C8=true;}else{var C9=A.lines.atIndex(C7).key;C8=(l(C9)||false);}Cs[C7]=C8;}return Cs[C7];\\n}var Cv={};function Cw(C7){if(Cv[C7]===undefined){i.consecutives++;Cv[C7]=(function(){var C9=Cu(C7-1);\\nvar C8=Cu(C7);if((!C9)||(!C8)){return false;}if((C9===true)&&(C8===true)){return !B.firstChild;}if((C9===true)&&C8.previousSibling){return false;\\n}if((C8===true)&&C9.nextSibling){return false;}if((C9===true)||(C8===true)){return true;}return C9.nextSibling==C8;\\n})();}return Cv[C7];}function Cx(C7){return !!Cu(C7);}var Cp=[[-1,Cq+1]];function C4(C7){var C8=-1;forEach(Cp,function(C9,DA){if(C7>=C9[1]){return false;\\n}if(C7\\x3cC9[0]){return true;}C8=DA;return true;});return C8;}function C3(C7,C8){var DA=Cp[C7][0];var C9=Cp[C7][1];\\nif((DA+1)==C9){Cp.splice(C7,1);}else{if(C8==DA){Cp[C7][0]++;}else{if(C8==(C9-1)){Cp[C7][1]--;}else{Cp.splice(C7,1,[DA,C8],[C8+1,C9]);\\n}}}}function Ct(C7,C8){var DA=Cp[C7][0];var C9=Cp[C7][1];Cp.splice(C7,1,[DA,C8],[C8,C9]);}var Cz={};function C1(C7){if(Cz[C7]){return true;\\n}i.corrections++;Cz[C7]=true;var C8=C4(C7);var DA=Cx(C7);if(C8\\x3c0){if(DA){S.debug("somehow lost clean line");\\n}return true;}if(!DA){C3(C8,C7);return false;}else{var DC=Cp[C8][0];var DB=Cp[C8][1];var C9=false;if(DC\\x3cC7&&Cx(C7-1)&&!Cw(C7)){Ct(C8,C7);\\nC9=true;}if(DB>(C7+1)&&Cx(C7+1)&&!Cw(C7+1)){Ct(C8,C7+1);C9=true;}return !C9;}}function Cy(C9,DA){var C8=0;\\nvar C7=C9;while(C8\\x3cDA&&C7>=0){if(C1(C7)){C8++;}else{C8=0;}C7--;}C8=0;C7=C9;while(C8\\x3cDA&&C7\\x3cCq){if(C1(C7)){C8++;\\n}else{C8=0;}C7++;}}if(Cq==0){i.cancel();if(!Cw(0)){Ct(0,0);}}else{i.mark("topbot");Cy(0,1);Cy(Cq-1,1);\\ni.mark("obs");for(var C6 in AE.cleanNodesNearChanges){var C2=C6.substring(1);if(A.lines.containsKey(C2)){var C5=A.lines.indexOfKey(C2);\\nCy(C5,2);}}i.mark("stats&calc");i.literal(i.forIndices,"byidx");i.literal(i.consecutives,"cons");i.literal(i.corrections,"corr");\\n}var C0=[];for(var Cr=0;Cr\\x3cCp.length-1;Cr++){C0.push([Cp[Cr][1],Cp[Cr+1][0]]);}i.end();return C0;}function z(Cp){var i={};\\ni.nodeId=L(Cp);i.knownHTML=Cp.innerHTML;if(browser.msie){i.knownText=Cp.innerText;}setAssoc(Cp,"dirtiness",i);\\n}function V(i){var Cq=O("cleanCheck",false);if(i.parentNode!=B){return true;}var Cp=getAssoc(i,"dirtiness");\\nif(!Cp){return true;}if(i.id!==Cp.nodeId){return true;}if(browser.msie){if(i.innerText!==Cp.knownText){return true;\\n}}if(i.innerHTML!==Cp.knownHTML){return true;}Cq.end();return false;}function A1(Ct,Cs){var Cq=Ct.lineNode;\\nvar Cp=Cq.offsetTop;var Cr=Cq.offsetHeight;var i=(Cs||{});i.top=Cp;i.bottom=(Cp+Cr);return i;}function B5(){var i=Ab();\\nvar Cq=F.document;var Cp=Cq.documentElement.clientHeight;return{top:i,bottom:(i+Cp)};}function Bs(){var Cq=B5();\\nvar Cr={};var Cp=A.lines.search(function(Cs){return A1(Cs,Cr).bottom>Cq.top;});var i=A.lines.search(function(Cs){return A1(Cs,Cr).top>=Cq.bottom;\\n});if(i\\x3cCp){i=Cp;}return[Cp,i];}function BI(){var i=Bs();return[A.lines.offsetOfIndex(i[0]),A.lines.offsetOfIndex(i[1])];\\n}function CY(Cp){a("handleClick",function(){H.atMost(200);});if((!Cp.ctrlKey)&&(Cp.button!=2)&&(Cp.button!=3)){function Cq(Ct){return(Ct.tagName||"").toLowerCase()=="a"&&Ct.href;\\n}var i=Cp.target;while(i&&i.parentNode&&!Cq(i)){i=i.parentNode;}if(i&&Cq(i)){try{var Cr=window.open(i.href,"_blank");\\nCr.focus();}catch(Cs){}Cp.preventDefault();}}}function Bu(){if(!(A.selStart&&A.selEnd)){return;}var i=A.selStart[0];\\nvar Cp=X(i);AY("\\\\n");if(Cp){if(i+1\\x3cA.lines.length()){Bg(i+1,Cp);}}else{CE();}}function AT(Cw){if(!(A.selStart&&A.selEnd)){return false;\\n}var Cq,Cv;Cq=A.selStart[0];Cv=Math.max(Cq,A.selEnd[0]-((A.selEnd[1]==0)?1:0));var Cr=[];var Cs=false;\\nfor(var Cp=Cq;Cp\\x3c=Cv;Cp++){var i=X(Cp);if(i){i=/([a-z]+)([12345678])/.exec(i);if(i){Cs=true;var Cx=i[1];\\nvar Ct=Number(i[2]);var Cu=Math.max(1,Math.min(BW,Ct+(Cw?-1:1)));if(Ct!=Cu){Cr.push([Cp,Cx+Cu]);}}}}if(Cr.length>0){AI(Cr);\\n}return Cs;}function Bw(i){if(!AT(i)){AY(Ad);}}function A5(C4){var Cu=C4||{};var Cw=false;if(A.selStart){if(U()){var Cv=m();\\nvar Ct=t();var Cp=A.lines.atIndex(Cv);var C0=Cp.text;var Cx=Cp.lineMarker;if(/^ +$/.exec(C0.substring(Cx,Ct))){var C3=Ct-Cx;\\nvar C1=Ad.length;var Cz=((C3-1)%C1)+1;f([Cv,Ct-Cz],[Cv,Ct],"");Cw=true;}}if(!Cw){if(U()){var i=m();var Cp=A.lines.atIndex(i);\\nif(t()\\x3c=Cp.lineMarker){var C6="delete_newline";var C2=(i>0?X(i-1):"");var C5=X(i);var Cq=(i>0&&A.lines.atIndex(i-1));\\nvar Cy=(Cq&&Cq.text.length==Cq.lineMarker);if(C5){if(Cy&&!C2){f([i-1,Cq.text.length],[i,0],"");}else{f([i,0],[i,Cp.lineMarker],"");\\n}}else{if(i>0){f([i-1,Cq.text.length],[i,0],"");}}}else{var Cr=A7();if(Cr>0){if(Cu.metaKey||Cu.ctrlKey||Cu.altKey){var Cs=Cr-1;\\nwhile(Cs>Cp.lineMarker&&n(A.alltext.charAt(Cs-1))){Cs--;}BA(Cs,Cr,"");}else{BA(Cr-1,Cr,"");}}}}else{AY("");\\n}}}}var Bf=/[\\\\u0030-\\\\u0039\\\\u0041-\\\\u005A\\\\u0061-\\\\u007A\\\\u00C0-\\\\u00D6\\\\u00D8-\\\\u00F6\\\\u00F8-\\\\u00FF\\\\u0100-\\\\u1FFF\\\\u3040-\\\\u9FFF\\\\uF900-\\\\uFDFF\\\\uFE70-\\\\uFEFE\\\\uFF10-\\\\uFF19\\\\uFF21-\\\\uFF3A\\\\uFF41-\\\\uFF5A\\\\uFF66-\\\\uFFDC]/;\\nvar CU=/\\\\s/;function n(i){return !!Bf.exec(i);}function Cf(i){return !!CU.exec(i);}function x(Cu,Cv,Cr){var Cp=Cv;\\nfunction Ct(){if(Cr){return Cu.charAt(Cp);}else{return Cu.charAt(Cp-1);}}function Cs(){if(Cr){Cp++;}else{Cp--;\\n}}function Cq(){if(Cr){return Cp>=Cu.length;}else{return Cp\\x3c=0;}}if(browser.windows&&Cr){while((!Cq())&&n(Ct())){Cs();\\n}while((!Cq())&&!n(Ct())){Cs();}}else{while((!Cq())&&!n(Ct())){Cs();}while((!Cq())&&n(Ct())){Cs();}}return Cp;\\n}function AM(i){if(AK&&top.DONT_INCORP){return;}if(!k){return;}var Cq=i.type;var Cw=i.charCode;var Cr=i.keyCode;\\nvar Cs="";if(i.altKey){Cs=Cs+"A";}if(i.ctrlKey){Cs=Cs+"C";}if(i.shiftKey){Cs=Cs+"S";}if(i.metaKey){Cs=Cs+"M";\\n}var Cz="";if(Cs){Cz=Cs+"-";}var Ct=i.which;var Cy=((!Cw)&&((Cq=="keyup")||(Cq=="keydown"))&&(Cr==16||Cr==17||Cr==18||Cr==20||Cr==224||Cr==91));\\nif(Cy){return;}var Cp=false;var Cv=((browser.msie||browser.safari)?(Cq=="keydown"):(Cq=="keypress"));\\nvar Cu=((browser.msie||browser.safari)?(Cq=="keydown"):(Cq=="keypress"));var Cx=false;a("handleKeyEvent",function(){if(Cq=="keypress"||(Cv&&Cr==13)){if(!Ar(i)){i.preventDefault();\\nCx=true;}}else{if(Cq=="keydown"){Au(i);}}if(!Cx){if(Cv&&Cr==8){G(3);i.preventDefault();A5(i);Cp=true;\\n}if((!Cp)&&Cv&&Cr==13){G(4);i.preventDefault();Bu();N.setTimeout(function(){F.scrollBy(-100,0);},0);Cp=true;\\n}if((!Cp)&&Cv&&Cr==9&&!(i.metaKey||i.ctrlKey)){G(5);i.preventDefault();Bw(i.shiftKey);Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="z"&&(i.metaKey||i.ctrlKey)){G(6);\\ni.preventDefault();if(i.shiftKey){s("redo");}else{s("undo");}Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="y"&&(i.metaKey||i.ctrlKey)){G(10);\\ni.preventDefault();s("redo");Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="b"&&(i.metaKey||i.ctrlKey)){G(13);\\ni.preventDefault();c("bold");Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="i"&&(i.metaKey||i.ctrlKey)){G(14);\\ni.preventDefault();c("italic");Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="u"&&(i.metaKey||i.ctrlKey)){G(15);\\ni.preventDefault();c("underline");Cp=true;}if((!Cp)&&Cu&&String.fromCharCode(Ct).toLowerCase()=="h"&&(i.ctrlKey)){G(20);\\ni.preventDefault();A5();Cp=true;}if(AA&&AA.handleKeyEvent(i)){i.preventDefault();Cp=true;}}if(Cq=="keydown"){H.atLeast(500);\\n}else{if(Cq=="keypress"){if((!Cp)&&AG.shouldNormalizeOnChar(Cw)){H.atMost(0);}else{H.atLeast(500);}}else{if(Cq=="keyup"){var C0=200;\\nH.atLeast(C0);H.atMost(C0);}}}var C2=(browser.mozilla&&i.altKey&&Cw==0&&Cr==0);var C1=(browser.safari&&i.altKey&&Cr==229);\\nif(AD||C2||C1){H.atLeast(3000);AD=true;}if((!Cp)&&(!AD)&&(!r)){if(Cq!="keyup"||!A8()){Aw();}}if(Cq=="keyup"){AD=false;\\n}});}var AD=false;function s(Cp){if(undoModule.enabled){var i;if(Cp=="undo"){i="performUndo";}if(Cp=="redo"){i="performRedo";\\n}if(i){var Cq=C.editEvent.eventType;C.startNewEvent(Cp);undoModule[i](function(Cs,Cr){if(Cs){b(Cs);}if(Cr){d(P(Cr.selStart),P(Cr.selEnd),Cr.selFocusAtStart);\\n}var Ct=C.startNewEvent(Cq,true);return Ct;});}}}function Ba(){var i=A.selStart,Cp=A.selEnd;if(!(i&&Cp)){AW(null);\\nreturn;}var Cr=(false&&browser.mozilla&&i&&Cp&&i[0]==Cp[0]&&i[1]==A.lines.atIndex(i[0]).lineMarker&&Cp[1]==A.lines.atIndex(Cp[0]).lineMarker&&Bk(i[0]));\\nvar Cq={};var Cs=[i[0],i[1]];if(Cr){Cs[1]+=1;}Cq.startPoint=Am(Cs);var Ct=[Cp[0],Cp[1]];if(Cr){Ct[1]+=1;\\n}Cq.endPoint=Am(Ct);Cq.focusAtStart=!!A.selFocusAtStart;AW(Cq);if(Cr){Cr.unhack();}}function Ca(){return map(A.lines.slice(),function(Cq){var Cp=Cq.text;\\nvar i;if(Cp.length==0){i=\\\'\\x3cspan style="color: #aaa">--\\x3c/span>\\\';}else{i=htmlPrettyEscape(Cp);}return"\\x3cdiv>\\x3ccode>"+i+"\\x3c/div>\\x3c/code>";\\n}).join("");}function j(i){if(isNodeText(i)){return i.nodeValue.length;}else{return 1;}}function CX(){var i;\\ntry{i=E.selection;}catch(Cq){}if(!i){return false;}var Cp;try{Cp=i.createRange();}catch(Cq){}if(!Cp){return false;\\n}var Cr=Cp.parentElement();if(Cr.ownerDocument!=E){return false;}return true;}function Ae(){if(browser.msie){var i;\\ntry{i=E.selection;}catch(Cx){}if(!i){return null;}var Cr;try{Cr=i.createRange();}catch(Cx){}if(!Cr){return null;\\n}var C0=Cr.parentElement();if(C0.ownerDocument!=E){return null;}function C1(){return E.body.createTextRange();\\n}function Cv(C3){var C2=C1();C2.moveToElementText(C3);return C2;}function Ct(C6){var C2=C6.parentElement();\\nvar C5=-1;var C8=C2.childNodes.length;var C7=Cv(C2);if(C6.compareEndPoints("StartToStart",C7)==0){return{node:C2,index:0,maxIndex:1};\\n}else{if(C6.compareEndPoints("EndToEnd",C7)==0){if(AF(C2)&&C2.nextSibling){return{node:C2.nextSibling,index:0,maxIndex:1};\\n}return{node:C2,index:1,maxIndex:1};}else{if(C2.childNodes.length==0){return{node:C2,index:0,maxIndex:1};\\n}}}for(var C3=0;C3\\x3cC2.childNodes.length;C3++){var DD=C2.childNodes.item(C3);if(!isNodeText(DD)){var DA=Cv(DD);\\nvar DE=C6.compareEndPoints("StartToStart",DA);var DH=C6.compareEndPoints("EndToEnd",DA);if(DE>=0&&DH\\x3c=0){var DG=0;\\nif(DE>0){DG=1;}return{node:DD,index:DG,maxIndex:1};}else{if(DH>0){if(C3>C5){C5=C3;C7.setEndPoint("StartToEnd",DA);\\n}}else{if(DE\\x3c0){if(C3\\x3cC8){C8=C3;C7.setEndPoint("EndToStart",DA);}}}}}}if((C8-C5)==1){if(C5>=0){return{node:C2.childNodes.item(C5),index:1,maxIndex:1};\\n}else{return{node:C2.childNodes.item(C8),index:0,maxIndex:1};}}var DF=0;var C9=C6.duplicate();var DI=binarySearchInfinite(40,function(DL){var DK=DL-DF;\\nvar DJ=Math.abs(C9.move("character",-DK));if(C9.move("character",-1)){C9.move("character",1);}if(DK\\x3c0){DF-=DJ;\\n}else{DF+=DJ;}return(C9.compareEndPoints("StartToStart",C7)\\x3c=0);});var DB=C5+1;var DC=DI;while(DB\\x3cC8){var C4=C2.childNodes.item(DB);\\nif(DC\\x3c=C4.nodeValue.length){return{node:C4,index:DC,maxIndex:C4.nodeValue.length};}DC-=C4.nodeValue.length;\\nDB++;}var C4=C2.childNodes.item(DB-1);return{node:C4,index:C4.nodeValue.length,maxIndex:C4.nodeValue.length};\\n}var Cq={};if(Cr.compareEndPoints("StartToEnd",Cr)==0){var Cs=Ct(Cr);Cq.startPoint=Cs;Cq.endPoint={node:Cs.node,index:Cs.index,maxIndex:Cs.maxIndex};\\n}else{var Cu=Cr.duplicate();Cu.collapse(true);var Cw=Cr.duplicate();Cw.collapse(false);Cq.startPoint=Ct(Cu);\\nCq.endPoint=Ct(Cw);}return Cq;}else{var i=window.getSelection();if(i&&i.type!="None"&&i.rangeCount!==0){var Cp=i.getRangeAt(0);\\nfunction Cz(C2){while(C2&&!(C2.tagName&&C2.tagName.toLowerCase()=="body")){C2=C2.parentNode;}return !!C2;\\n}function Cy(C7,C6){if(!Cz(C7)){return{node:B,index:0,maxIndex:1};}var C2=C7;var C5=C2.childNodes.length;\\nif(isNodeText(C2)){return{node:C2,index:C6,maxIndex:C2.nodeValue.length};}else{if(C5==0){return{node:C2,index:0,maxIndex:1};\\n}else{if(C6==C5){var C3=C2.childNodes.item(C5-1);var C4=j(C3);return{node:C3,index:C4,maxIndex:C4};}else{var C3=C2.childNodes.item(C6);\\nvar C4=j(C3);return{node:C3,index:0,maxIndex:C4};}}}}var Cq={};Cq.startPoint=Cy(Cp.startContainer,Cp.startOffset);\\nCq.endPoint=Cy(Cp.endContainer,Cp.endOffset);Cq.focusAtStart=(((Cp.startContainer!=Cp.endContainer)||(Cp.startOffset!=Cp.endOffset))&&i.anchorNode&&(i.anchorNode==Cp.endContainer)&&(i.anchorOffset==Cp.endOffset));\\nreturn Cq;}else{return null;}}}function AW(i){function Cv(C5){return{node:C5.node,index:C5.index,maxIndex:C5.maxIndex};\\n}if(browser.msie){E.body.scrollHeight;function Cz(C6,C5){while(C5.firstChild&&!isNodeText(C5.firstChild)){C5=C5.firstChild;\\n}C6.moveToElementText(C5);}function C4(){return E.body.createTextRange();}function Cs(C5,C6){if(isNodeText(C6)){if(C6.previousSibling&&!isNodeText(C6.previousSibling)){Cx(C5,C6.previousSibling);\\n}else{Cs(C5,C6.parentNode);}}else{Cz(C5,C6);if(C5.move("character",1)){C5.move("character",-1);}C5.collapse(true);\\n}}function Cx(C5,C6){if(isNodeText(C6)){Cs(C5,C6);C5.move("character",C6.nodeValue.length);}else{Cz(C5,C6);\\nC5.collapse(false);}}function Cy(C7){var C5=C4();var C6=C7.node;if(isNodeText(C6)){Cs(C5,C6);C5.move("character",C7.index);\\n}else{if(C7.index==0){Cs(C5,C6);}else{Cx(C5,C6);}}return C5;}if(i){if(!CX()){return;}var C1=Cv(i.startPoint);\\nvar Cp=Cv(i.endPoint);if(Cp.index==Cp.maxIndex&&Cp.node.nextSibling){Cp.node=Cp.node.nextSibling;Cp.index=0;\\nCp.maxIndex=j(Cp.node);}var Cr=Cy(C1);Cr.setEndPoint("EndToEnd",Cy(Cp));function C3(C7){var C6;try{C6=E.selection;\\n}catch(C8){}if(!C6){return false;}var C5=C6.createRange();if(C5.parentElement().ownerDocument!=E){return false;\\n}if(C7.compareEndPoints("StartToStart",C5)!==0){return false;}if(C7.compareEndPoints("EndToEnd",C5)!==0){return false;\\n}return true;}if(!C3(Cr)){Cr.select();}}else{try{E.selection.empty();}catch(C2){}}}else{var Cw;function C0(C8){var C5=Cv(C8);\\nif(Cw){function C7(){while(C5.node.childNodes.length>0){if(C5.index==0){C5.node=C5.node.firstChild;C5.maxIndex=j(C5.node);\\n}else{if(C5.index==C5.maxIndex){C5.node=C5.node.lastChild;C5.maxIndex=j(C5.node);C5.index=C5.maxIndex;\\n}else{break;}}}}if(isNodeText(C5.node)&&C5.index==C5.maxIndex){var C6=C5.node;while((!C6.nextSibling)&&(C6!=B)&&(C6.parentNode!=B)){C6=C6.parentNode;\\n}if(C6.nextSibling&&(!((typeof C6.nextSibling.tagName)=="string"&&C6.nextSibling.tagName.toLowerCase()=="br"))&&(C6!=C5.node)&&(C6!=B)&&(C6.parentNode!=B)){C5.node=C6.nextSibling;\\nC5.maxIndex=j(C5.node);C5.index=0;C7();}}if(!isNodeText(C5.node)){C7();}}if(isNodeText(C5.node)){return{container:C5.node,offset:C5.index};\\n}else{return{container:C5.node.parentNode,offset:Bx(C5.node)+C5.index};}}var Cq=window.getSelection();\\nif(Cq){Cq.removeAllRanges();if(i){Cw=(i.startPoint.node===i.endPoint.node&&i.startPoint.index===i.endPoint.index);\\nvar Ct=C0(i.startPoint);var Cu=C0(i.endPoint);if((!Cw)&&i.focusAtStart&&Cq.collapse&&Cq.extend){Cq.collapse(Cu.container,Cu.offset);\\nCq.extend(Ct.container,Ct.offset);}else{var Cr=E.createRange();Cr.setStart(Ct.container,Ct.offset);Cr.setEnd(Cu.container,Cu.offset);\\nCq.removeAllRanges();Cq.addRange(Cr);}}}}}function Bx(i){var Cp=0;while(i.previousSibling){Cp++;i=i.previousSibling;\\n}return Cp;}function h(){if(AO()==0||Ak()==0){return;}function Cp(C3,C4,i){if(C3[C4]!=i){C3[C4]=i;}}var Cx=T.firstChild.offsetWidth;\\nvar Cs=Cx+CC;if(Cs\\x3cAh){Cs=Ah;}p=BS;if(AP){p+=Cs+BO;}Cp(g.style,"left",p+"px");Cp(T.style,"width",Cs+"px");\\nfor(var Cv=0;Cv\\x3c2;Cv++){var Cq=B.clientHeight;var Cr=(browser.msie?B.createTextRange().boundingWidth:B.clientWidth);\\nvar Ct=Ak()-Bo-Aj;var Cu=AO()-p-CQ;if(Cq\\x3cCt){Cq=Ct;if(browser.msie){Cp(F.document.documentElement.style,"overflowY","auto");\\n}}else{if(browser.msie){Cp(F.document.documentElement.style,"overflowY","scroll");}}if(K){Cr=Cu;}else{if(Cr\\x3cCu){Cr=Cu;\\n}}if(Cq>32000){Cq=32000;}if(Cr>32000){Cr=32000;}Cp(g.style,"height",Cq+"px");Cp(g.style,"width",Cr+"px");\\nCp(T.style,"height",Cq+"px");}if(browser.mozilla){if(!K){var Cy=B;var Cw=Ct+"px";Cp(Cy.style,"height",Cw);\\n}else{Cp(B.style,"height","");}}var C2=BB();var C1=Ab();var C0=F;var Cz=20;Ax();o(T,"sidedivdelayed");\\n}function BE(){var Cp=F;var Cq=F.document;if(typeof(Cp.pageYOffset)=="number"){return{x:Cp.pageXOffset,y:Cp.pageYOffset};\\n}var i=Cq.documentElement;if(i&&typeof(i.scrollTop)=="number"){return{x:i.scrollLeft,y:i.scrollTop};}}function BB(){return BE().x;\\n}function Ab(){return BE().y;}function Cm(i){F.scrollTo(i,Ab());}function Cl(i){F.scrollTo(BB(),i);}function Ch(i,Cp){F.scrollTo(i,Cp);\\n}var BM=[];function BF(){forEach(BM,function(i){i();});}J(window,"load",CB);function Az(i){try{function Cp(Cs,Cu,Ct){if(String(Cs[Cu]).toLowerCase()!=Ct){Cs[Cu]=Ct;\\nreturn true;}return false;}if(browser.msie||browser.safari){Cp(B,"contentEditable",(i?"true":"false"));\\n}else{var Cq=Cp(E,"designMode",(i?"on":"off"));if(Cq&&i&&browser.opera){A9();}}return true;}catch(Cr){return false;\\n}}var Cg=null;function B3(Cp){var i=window.clipboardData&&window.clipboardData.getData("Text");if(i&&E.selection){}}var r=false;\\nfunction A6(i){if(i.type=="compositionstart"){r=true;}else{if(i.type=="compositionend"){r=false;}}}function A9(){J(window,"unload",BF);\\nJ(document,"keydown",AM);J(document,"keypress",AM);J(document,"keyup",AM);J(document,"click",CY);J(B,"blur",CJ);\\nif(browser.msie){J(document,"click",CM);}if(browser.msie){J(B,"paste",B3);}if((!browser.msie)&&document.documentElement){J(document.documentElement,"compositionstart",A6);\\nJ(document.documentElement,"compositionend",A6);}}function CM(i){if((i.target.tagName||"").toLowerCase()!="html"){return;\\n}if(!(i.pageY>B.clientHeight)){return;}a("handleOuterClick",function(){G(11);if(U()){var Cp=A.lines.length()-1;\\nvar Cq=A.lines.atIndex(Cp).text.length;d([Cp,Cq],[Cp,Cq]);}});}function BC(Cq,i){var Cp=[];(Cq.className||"").replace(/\\\\S+/g,function(Cr){if((!i)||(i(Cr))){Cp.push(Cr);\\n}});return Cp;}function Ay(i,Cp){i.className=Cp.join(" ");}function o(Cq,Cp){var i=false;var Cr=BC(Cq,function(Cs){if(Cs==Cp){i=true;\\n}return true;});if(!i){Cr.push(Cp);Ay(Cq,Cr);}}function CG(Cp,Cq){var i=false;var Cr=BC(Cp,function(Cs){if(Cs==Cq){i=true;\\nreturn false;}return true;});if(i){Ay(Cp,Cr);}}function Q(Cp,i,Cq){if(Cq){o(Cp,i);}else{CG(Cp,i);}}function CB(){E=document;\\na("setup",function(){var Cp=E.getElementById("innerdocbody");B=Cp;if(browser.mozilla){o(B,"mozilla");\\n}if(browser.safari){o(B,"safari");}if(browser.msie){o(B,"msie");}if(browser.msie){try{E.execCommand("BackgroundImageCache",false,true);\\n}catch(Cq){}}Q(B,"authorColors",true);Q(B,"doesWrap",K);Bh();Ax();while(B.firstChild){B.removeChild(B.firstChild);\\n}var i=AN("");AJ(0,A.lines.length(),[i]);AH(null,[i.domInfo],null);A.alines=Changeset.splitAttributionLines(Changeset.makeAttribution("\\\\n"),"\\\\n");\\nA9();});N.setTimeout(function(){parent.readyFunc();},0);B4=true;}function Bc(){window.focus();}function CJ(i){if(browser.msie){AW(null);\\n}}function J(Cp,Cq,i){var Cr;if((typeof i._wrapper)!="function"){i._wrapper=function(Cs){i(CO(Cs||window.event||{}));\\n};}var Cr=i._wrapper;if(Cp.addEventListener){Cp.addEventListener(Cq,Cr,false);}else{Cp.attachEvent("on"+Cq,Cr);\\n}BM.push(function(){B2(Cp,Cq,i);});}function B2(i,Cq,Cr){var Cp=Cr._wrapper;if(i.removeEventListener){i.removeEventListener(Cq,Cp,false);\\n}else{i.detachEvent("on"+Cq,Cp);}}function B0(Cw){var Cp=Cw.node;var Ct=Cw.index;function Cq(C0){return C0.offsetLeft;\\n}function Cr(C0){return C0.offsetLeft+C0.offsetWidth;}if(!isNodeText(Cp)){if(Ct==0){return Cq(Cp);}else{return Cr(Cp);\\n}}else{var Cs=Ct;var Cv=Cp.nodeValue.length-Ct;var i;for(i=Cp.previousSibling;i&&isNodeText(i);i=i.previousSibling){Cs+=i.nodeValue;\\n}var Cu=(i?Cr(i):Cq(Cp.parentNode));for(i=Cp.nextSibling;i&&isNodeText(i);i=i.nextSibling){Cv+=i.nodeValue;\\n}var Cz=(i?Cq(i):Cr(Cp.parentNode));var Cx=(Cs/(Cs+Cv));var Cy=Cu+Cx*(Cz-Cu);return Math.round(Cy);}}function Cd(){var i=F;\\nvar Cp=i.document;if(i.innerHeight&&i.scrollMaxY){return i.innerHeight+i.scrollMaxY;}else{if(Cp.body.scrollHeight>Cp.body.offsetHeight){return Cp.body.scrollHeight;\\n}else{return Cp.body.offsetHeight;}}}function Cn(){var i=F;var Cp=i.document;if(i.innerWidth&&i.scrollMaxX){return i.innerWidth+i.scrollMaxX;\\n}else{if(Cp.body.scrollWidth>Cp.body.offsetWidth){return Cp.body.scrollWidth;}else{return Cp.body.offsetWidth;\\n}}}function Ak(){var Cp=F;var Cq=Cp.document;var i;if(browser.opera){i=Cp.innerHeight;}else{i=Cq.documentElement.clientHeight;\\n}if(i){return i;}return Number(D.frame.parentNode.style.height.replace(/[^0-9]/g,"")||0);}function AO(){var Cp=F;\\nvar i=Cp.document;return i.documentElement.clientWidth;}function Bt(Cp){var i=F;var Cs=F.document;var Cq=Cp.offsetTop+Aj-i.scrollY;\\nvar Cr=i.scrollY+Ak()-(Cp.offsetTop+Aj+Cp.offsetHeight);if(Cq\\x3c0){i.scrollBy(0,Cq);}else{if(Cr\\x3c0){i.scrollBy(0,-Cr);\\n}}}function CT(Cp){var i=F;var Cs=F.document;Cp+=p;var Cq=Cp-i.scrollX;var Cr=i.scrollX+AO()-Cp;if(Cq\\x3c0){i.scrollBy(Cq,0);\\n}else{if(Cr\\x3c0){i.scrollBy(-Cr+1,0);}}}function CP(){if(!A.selStart){return;}h();var Cq=(A.selFocusAtStart?A.selStart[0]:A.selEnd[0]);\\nBt(A.lines.atIndex(Cq).lineNode);if(!K){var i=Ae();if(i){var Cr=(i.focusAtStart?i.startPoint:i.endPoint);\\nvar Cp=B0(Cr);CT(Cp);h();}}}function X(Cq){var Cp=A.alines[Cq];if(Cp){var i=Changeset.opIterator(Cp);\\nif(i.hasNext()){return Changeset.opAttributeValue(i.next(),"list",A.apool)||"";}}return"";}function Bg(Cp,i){AI([[Cp,i]]);\\n}function AI(Cw){var Cp=[0,0];var Cq=Changeset.builder(A.lines.totalWidth());for(var Ct=0;Ct\\x3cCw.length;\\nCt++){var Cv=Cw[Ct];var Cs=Cv[0];var Cr=Cv[1];AR(Cq,Cp,(Cp=[Cs,0]));if(X(Cs)){if(Cr){AR(Cq,Cp,(Cp=[Cs,1]),[["list",Cr]],A.apool);\\n}else{BQ(Cq,Cp,(Cp=[Cs,1]));}}else{if(Cr){Cq.insert("*",[["author",e],["insertorder","first"],["list",Cr]],A.apool);\\n}}}var Cu=Cq.toString();if(!Changeset.isIdentity(Cu)){b(Cu);}}function As(){if(!(A.selStart&&A.selEnd)){return;\\n}var Cp,Cq;Cp=A.selStart[0];Cq=Math.max(Cp,A.selEnd[0]-((A.selEnd[1]==0)?1:0));var Ct=true;for(var i=Cp;\\ni\\x3c=Cq;i++){if(!X(i)){Ct=false;break;}}var Cs=[];for(var i=Cp;i\\x3c=Cq;i++){var Cr=X(i);Cs.push([i,Ct?"":(Cr?Cr:"bullet1")]);\\n}AI(Cs);}var AA=(browser.mozilla&&(function(){var i=0;var Cp=false;function Cr(Cu){var Ct=A.lines.atIndex(Cu).lineNode;\\nwhile(Ct.firstChild&&AF(Ct.firstChild)){Ct=Ct.firstChild;}return makeVirtualLineView(Ct);}function Cs(Ct,Cu){return[Ct,Cu-A.lines.atIndex(Ct).lineMarker];\\n}function Cq(Ct,Cu){return[Ct,Cu+A.lines.atIndex(Ct).lineMarker];}return{notifySelectionChanged:function(){if(!Cp){i=0;\\n}},handleKeyEvent:function(C0){if(C0.type!="keypress"){return false;}var Cw=C0.keyCode;if(Cw\\x3c37||Cw>40){return false;\\n}q();if(!(A.selStart&&A.selEnd)){return true;}var Cx=(C0.altKey?"byWord":(C0.ctrlKey?"byWord":(C0.metaKey?"toEnd":"normal")));\\nvar Cu=Cs(A.selStart[0],A.selStart[1]);var Ct=Cs(A.selEnd[0],A.selEnd[1]);var DB=U();if(A.selFocusAtStart){var DK=Cu;\\nCu=Ct;Ct=DK;}var DH=38,DJ=40,C7=37,DE=39;var C8=false;if(DB&&!C0.shiftKey){Cu=Ct;}else{if((!DB)&&(!C0.shiftKey)){if(Cw==C7){if(A.selFocusAtStart){Cu=Ct;\\n}else{Ct=Cu;}if(Cx=="normal"){C8=true;}}else{if(Cw==DE){if(A.selFocusAtStart){Ct=Cu;}else{Cu=Ct;}if(Cx=="normal"){C8=true;\\n}}else{Cu=Ct;}}}}if(!C8){function C1(DN){var DM=A.lines.atIndex(DN);return DM.text.length-DM.lineMarker;\\n}function C4(DN){var DM=A.lines.atIndex(DN);return DM.text.substring(DM.lineMarker);}if(Cw==DH||Cw==DJ){var Cy=(Cw==DH);\\nvar C3=((Cy&&Ct[0])||((!Cy)&&Ct[0]\\x3cA.lines.length()-1));var C6,C2,DA=false;if(K){C6=Cr(Ct[0]);C2=C6.getVLineAndOffsetForChar(Ct[1]);\\nDA=((Cy&&C2.vline>0)||((!Cy)&&C2.vline\\x3c(C6.getNumVirtualLines()-1)));}var DL;if(Cx=="toEnd"){if(Cy){Ct[0]=0;\\nCt[1]=0;}else{Ct[0]=A.lines.length()-1;Ct[1]=C1(Ct[0]);}}else{if(Cx=="byWord"){if(Cy){if(Ct[1]==0&&C3){Ct[0]--;\\nCt[1]=0;}else{Ct[1]=0;}}else{var Cz=C1(Ct[0]);if(browser.windows){if(C3){Ct[0]++;Ct[1]=0;}else{Ct[1]=Cz;\\n}}else{if(Ct[1]==Cz&&C3){Ct[0]++;Ct[1]=C1(Ct[0]);}else{Ct[1]=Cz;}}}i=0;}else{if(DA){var C5=C2.vline;var Cv=C2.offset;\\nif(Cy){C5--;}else{C5++;}if(i>Cv){Cv=i;}else{i=Cv;}var DF=C6.getCharForVLineAndOffset(C5,Cv);Ct[1]=DF.lineChar;\\n}else{if(C3){if(Cy){Ct[0]--;}else{Ct[0]++;}var Cv=Ct[1];if(K){Cv=C2.offset;}if(i>Cv){Cv=i;}else{i=Cv;\\n}if(K){var DG=Cr(Ct[0]);var C5=(Cy?DG.getNumVirtualLines()-1:0);var DF=DG.getCharForVLineAndOffset(C5,Cv);\\nCt[1]=DF.lineChar;}else{var Cz=C1(Ct[0]);if(Cv>Cz){Cv=Cz;}Ct[1]=Cv;}}else{if(Cy){Ct[1]=0;}else{Ct[1]=C1(Ct[0]);\\n}i=0;}}}}}else{if(Cw==C7||Cw==DE){var DI=(Cw==C7);if(DI){if(Cx=="toEnd"){Ct[1]=0;}else{if(Ct[1]>0){if(Cx=="byWord"){Ct[1]=x(C4(Ct[0]),Ct[1],false);\\n}else{Ct[1]--;}}else{if(Ct[0]>0){Ct[0]--;Ct[1]=C1(Ct[0]);if(Cx=="byWord"){Ct[1]=x(C4(Ct[0]),Ct[1],false);\\n}}}}}else{var Cz=C1(Ct[0]);if(Cx=="toEnd"){Ct[1]=Cz;}else{if(Ct[1]\\x3cCz){if(Cx=="byWord"){Ct[1]=x(C4(Ct[0]),Ct[1],true);\\n}else{Ct[1]++;}}else{if(Ct[0]\\x3cA.lines.length()-1){Ct[0]++;Ct[1]=0;if(Cx=="byWord"){Ct[1]=x(C4(Ct[0]),Ct[1],true);\\n}}}}}i=0;}}}var C9=((Ct[0]\\x3cCu[0])||(Ct[0]==Cu[0]&&Ct[1]\\x3cCu[1]));var DD=(C9?Ct:Cu);var DC=(C9?Cu:Ct);Cp=true;\\nd(Cq(DD[0],DD[1]),Cq(DC[0],DC[1]),C9);Cp=false;C.userChangedSelection=true;return true;}};})());function CO(i){var Cp=i;\\ni=extend({},Cp);i.preventDefault=function(){if(Cp.preventDefault){Cp.preventDefault();}Cp.returnValue=false;\\n};i.stopPropagation=function(){if(Cp.stopPropagation){Cp.stopPropagation();}Cp.cancelBubble=true;};if(!i.target&&i.srcElement){i.target=i.srcElement;\\n}if(browser.safari&&i.target.nodeType==3){i.target=Cp.target.parentNode;}if(!i.relatedTarget&&i.fromElement){i.relatedTarget=i.fromElement==i.target?i.toElement:i.fromElement;\\n}if(i.pageX==null&&i.clientX!=null){var Cq=document.documentElement,Cr=document.body;i.pageX=i.clientX+(Cq&&Cq.scrollLeft||Cr.scrollLeft||0);\\ni.pageY=i.clientY+(Cq&&Cq.scrollTop||Cr.scrollTop||0);}if(!i.which&&(i.charCode||i.keyCode)){i.which=i.charCode||i.keyCode;\\n}if(!i.metaKey&&i.ctrlKey){i.metaKey=i.ctrlKey;}if(!i.which&&i.button){i.which=(i.button&1?1:(i.button&2?3:(i.button&4?2:0)));\\n}return i;}var Z;var Ai;function BX(){Z=1;T.innerHTML=\\\'\\x3ctable border="0" cellpadding="0" cellspacing="0" align="right">\\x3ctr>\\x3ctd id="sidedivinner">\\x3cdiv>1\\x3c/div>\\x3c/td>\\x3c/tr>\\x3c/table>\\\';\\nAi=F.document.getElementById("sidedivinner");}function CN(){var Cq=A.lines.length();if(Cq\\x3c1){Cq=1;}if(Cq!=Z){var Cr=Ai;\\nvar Cv=F.document;while(Z\\x3cCq){Z++;var Cw=Z;var Ct=Cv.createElement("DIV");Ct.appendChild(Cv.createTextNode(String(Cw)));\\nCr.appendChild(Ct);}while(Z>Cq){Cr.removeChild(Cr.lastChild);Z--;}}if(C&&C.domClean){var Cp=Ai.firstChild;\\nvar i=E.body.firstChild;while(Cp&&i){var Cs=(i.clientHeight||i.offsetHeight);if(i.nextSibling){Cs=i.nextSibling.offsetTop-i.offsetTop;\\n}if(Cs){var Cu=Cs+"px";if(Cp.style.height!=Cu){Cp.style.height=Cu;}}Cp=Cp.nextSibling;i=i.nextSibling;\\n}}}}OUTER(this);\'+\'//-->\\n\\x3c/script>\')'));
T.push('\'\\n<style type="text/css" title="dynamicsyntax"></style>\\n\'');T.push('\'</head><body id="innerdocbody" class="syntax" spellcheck="false">&nbsp;</body></html>\'');
var X='editorId = "'+A.id+'"; editorInfo = parent.'+K+'.registry[editorId]; window.onload = function() { window.onload = null; setTimeout(function() { var iframe = document.createElement("IFRAME"); iframe.scrolling = "no"; var outerdocbody = document.getElementById("outerdocbody"); iframe.frameBorder = 0; iframe.allowTransparency = true; outerdocbody.insertBefore(iframe, outerdocbody.firstChild); iframe.ace_outerWin = window; readyFunc = function() { editorInfo.onEditorReady(); readyFunc = null; editorInfo = null; }; var doc = iframe.contentWindow.document; doc.open(); doc.write('+T.join("+")+"); doc.close(); }, 0); }";
var Y=[W,"<html><head>",('<style type="text/css">body{margin:0;white-space:nowrap;}#outerdocbody{background-color:#fff;}body.grayedout{background-color:#eee!important;}#innerdocbody{font-size:12px;font-family:monospace;line-height:16px;}body.doesWrap{white-space:normal;}#innerdocbody{padding-top:1px;padding-right:10px;padding-bottom:8px;padding-left:1px;overflow:hidden;background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);}#sidediv{font-size:11px;font-family:monospace;line-height:16px;padding-top:8px;padding-right:3px;position:absolute;width:20px;top:0;left:0;cursor:default;color:white;}#sidedivinner{text-align:right;}.sidedivdelayed{background-color:#eee;color:#888!important;border-right:1px solid #999;}.sidedivhidden{display:none;}#outerdocbody iframe{display:block;position:relative;left:32px;top:7px;border:0;width:1px;height:1px;}#outerdocbody .hotrect{border:1px solid #999;position:absolute;}body.mozilla,body.safari{display:table-cell;}body.doesWrap{display:block!important;}.safari div{padding-right:1px;}p{margin:0;}#linemetricsdiv{position:absolute;left:-1000px;top:-1000px;color:white;z-index:-1;font-size:12px;font-family:monospace;}#overlaysdiv{position:absolute;left:-1000px;top:-1000px;}</style>'),'<link rel="stylesheet" type="text/css" href="data:text/css,"/>',"\x3cscript>",X,"\x3c/script>",'</head><body id="outerdocbody"><div id="sidediv"><!-- --></div><div id="linemetricsdiv">x</div><div id="overlaysdiv"><!-- --></div></body></html>'];
var U=document.createElement("IFRAME");U.frameBorder=0;A.frame=U;document.getElementById(Q).appendChild(U);
var V=U.contentWindow.document;V.open();V.write(Y.join(""));V.close();B.adjustSize();})();};return B;
}
jQuery.ajaxSetup({
  beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
});

jQuery.fn.submitWithAjax = function(callback) {
  this.submit(function() {
    $.post(this.action, $(this).serialize(), callback, "script");
    return false;
  });
  return this;
};
/**
 * AJAX Upload ( http://valums.com/ajax-upload/ )
 * Copyright (c) Andris Valums
 * Licensed under the MIT license ( http://valums.com/mit-license/ )
 * Thanks to Gary Haran, David Mark, Corey Burns and others for contributions
 */
(function () {
    /* global window */
    /* jslint browser: true, devel: true, undef: true, nomen: true, bitwise: true, regexp: true, newcap: true, immed: true */

    /**
     * Wrapper for FireBug's console.log
     */
    function log(){
        if (typeof(console) != 'undefined' && typeof(console.log) == 'function'){
            Array.prototype.unshift.call(arguments, '[Ajax Upload]');
            console.log( Array.prototype.join.call(arguments, ' '));
        }
    }

    /**
     * Attaches event to a dom element.
     * @param {Element} el
     * @param type event name
     * @param fn callback This refers to the passed element
     */
    function addEvent(el, type, fn){
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, function(){
                fn.call(el);
	        });
	    } else {
            throw new Error('not supported or DOM not loaded');
        }
    }

    /**
     * Attaches resize event to a window, limiting
     * number of event fired. Fires only when encounteres
     * delay of 100 after series of events.
     *
     * Some browsers fire event multiple times when resizing
     * http://www.quirksmode.org/dom/events/resize.html
     *
     * @param fn callback This refers to the passed element
     */
    function addResizeEvent(fn){
        var timeout;

	    addEvent(window, 'resize', function(){
            if (timeout){
                clearTimeout(timeout);
            }
            timeout = setTimeout(fn, 100);
        });
    }

    if (document.documentElement.getBoundingClientRect){
        var getOffset = function(el){
            var box = el.getBoundingClientRect();
            var doc = el.ownerDocument;
            var body = doc.body;
            var docElem = doc.documentElement; // for ie
            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var zoom = 1;
            if (body.getBoundingClientRect) {
                var bound = body.getBoundingClientRect();
                zoom = (bound.right - bound.left) / body.clientWidth;
            }

            if (zoom > 1) {
                clientTop = 0;
                clientLeft = 0;
            }

            var top = box.top / zoom + (window.pageYOffset || docElem && docElem.scrollTop / zoom || body.scrollTop / zoom) - clientTop, left = box.left / zoom + (window.pageXOffset || docElem && docElem.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;

            return {
                top: top,
                left: left
            };
        };
    } else {
        var getOffset = function(el){
            var top = 0, left = 0;
            do {
                top += el.offsetTop || 0;
                left += el.offsetLeft || 0;
                el = el.offsetParent;
            } while (el);

            return {
                left: left,
                top: top
            };
        };
    }

    /**
     * Returns left, top, right and bottom properties describing the border-box,
     * in pixels, with the top-left relative to the body
     * @param {Element} el
     * @return {Object} Contains left, top, right,bottom
     */
    function getBox(el){
        var left, right, top, bottom;
        var offset = getOffset(el);
        left = offset.left;
        top = offset.top;

        right = left + el.offsetWidth;
        bottom = top + el.offsetHeight;

        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    }

    /**
     * Helper that takes object literal
     * and add all properties to element.style
     * @param {Element} el
     * @param {Object} styles
     */
    function addStyles(el, styles){
        for (var name in styles) {
            if (styles.hasOwnProperty(name)) {
                el.style[name] = styles[name];
            }
        }
    }

    /**
     * Function places an absolutely positioned
     * element on top of the specified element
     * copying position and dimentions.
     * @param {Element} from
     * @param {Element} to
     */
    function copyLayout(from, to){
      var left = 0;

      var element = from, valueL = 0;
      do {
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);

      to.style.position = 'fixed';
      to.style.bottom = '16px';
      to.style.left   = valueL + 'px';
      to.style.height = from.offsetHeight + 'px';
      to.style.width  = from.offsetWidth + "px";
    }

    /**
    * Creates and returns element from html chunk
    * Uses innerHTML to create an element
    */
    var toElement = (function(){
        var div = document.createElement('div');
        return function(html){
            div.innerHTML = html;
            var el = div.firstChild;
            return div.removeChild(el);
        };
    })();

    /**
     * Function generates unique id
     * @return unique id
     */
    var getUID = (function(){
        var id = 0;
        return function(){
            return 'ValumsAjaxUpload' + id++;
        };
    })();

    /**
     * Get file name from path
     * @param {String} file path to file
     * @return filename
     */
    function fileFromPath(file){
        return file.replace(/.*(\/|\\)/, "");
    }

    /**
     * Get file extension lowercase
     * @param {String} file name
     * @return file extenstion
     */
    function getExt(file){
        return (-1 !== file.indexOf('.')) ? file.replace(/.*[.]/, '') : '';
    }

    function hasClass(el, name){
        var re = new RegExp('\\b' + name + '\\b');
        return re.test(el.className);
    }
    function addClass(el, name){
        if ( ! hasClass(el, name)){
            el.className += ' ' + name;
        }
    }
    function removeClass(el, name){
        var re = new RegExp('\\b' + name + '\\b');
        el.className = el.className.replace(re, '');
    }

    function removeNode(el){
        el.parentNode.removeChild(el);
    }

    /**
     * Easy styling and uploading
     * @constructor
     * @param button An element you want convert to
     * upload button. Tested dimentions up to 500x500px
     * @param {Object} options See defaults below.
     */
    window.AjaxUpload = function(button, options){
        this._settings = {
            action: 'upload.php',
            name: 'userfile',
            data: {},
            autoSubmit: true,
            responseType: false,
            hoverClass: 'hover',
            disabledClass: 'disabled',
            onChange: function(file, extension){
            },
            onSubmit: function(file, extension){
            },
            onComplete: function(file, response){
            }
        };

        for (var i in options) {
            if (options.hasOwnProperty(i)){
                this._settings[i] = options[i];
            }
        }

        if (button.jquery){
            button = button[0];
        } else if (typeof button == "string") {
            if (/^#.*/.test(button)){
                button = button.slice(1);
            }

            button = document.getElementById(button);
        }

        if ( ! button || button.nodeType !== 1){
            throw new Error("Please make sure that you're passing a valid element");
        }

        if ( button.nodeName.toUpperCase() == 'A'){
            addEvent(button, 'click', function(e){
                if (e && e.preventDefault){
                    e.preventDefault();
                } else if (window.event){
                    window.event.returnValue = false;
                }
            });
        }

        this._button = button;
        this._input = null;
        this._disabled = false;

        this.enable();

        this._rerouteClicks();
    };

    AjaxUpload.prototype = {
        setData: function(data){
            this._settings.data = data;
        },
        disable: function(){
            addClass(this._button, this._settings.disabledClass);
            this._disabled = true;

            var nodeName = this._button.nodeName.toUpperCase();
            if (nodeName == 'INPUT' || nodeName == 'BUTTON'){
                this._button.setAttribute('disabled', 'disabled');
            }

            if (this._input){
                this._input.parentNode.style.visibility = 'hidden';
            }
        },
        enable: function(){
            removeClass(this._button, this._settings.disabledClass);
            this._button.removeAttribute('disabled');
            this._disabled = false;

        },
        /**
         * Creates invisible file input
         * that will hover above the button
         * <div><input type='file' /></div>
         */
        _createInput: function(){
            var self = this;

            var input = document.createElement("input");
            input.setAttribute('type', 'file');
            input.setAttribute('name', this._settings.name);

            addStyles(input, {
                'position' : 'absolute',
                'right' : 0,
                'margin' : 0,
                'padding' : 0,
                'fontSize' : '480px',
                'cursor' : 'pointer'
            });

            var div = document.createElement("div");
            addStyles(div, {
                'display' : 'block',
                'position' : 'absolute',
                'overflow' : 'hidden',
                'margin' : 0,
                'padding' : 0,
                'opacity' : 0,
                'direction' : 'ltr',
                'zIndex': 2147483583
            });

            if ( div.style.opacity !== "0") {
                if (typeof(div.filters) == 'undefined'){
                    throw new Error('Opacity not supported by the browser');
                }
                div.style.filter = "alpha(opacity=0)";
            }

            addEvent(input, 'change', function(){

                if ( ! input || input.value === ''){
                    return;
                }

                var file = fileFromPath(input.value);

                if (false === self._settings.onChange.call(self, file, getExt(file))){
                    self._clearInput();
                    return;
                }

                if (self._settings.autoSubmit) {
                    self.submit();
                }
            });

            addEvent(input, 'mouseover', function(){
                addClass(self._button, self._settings.hoverClass);
            });

            addEvent(input, 'mouseout', function(){
                removeClass(self._button, self._settings.hoverClass);

                input.parentNode.style.visibility = 'hidden';

            });

	        div.appendChild(input);
          document.body.appendChild(div);

          this._input = input;
        },
        _clearInput : function(){
            if (!this._input){
                return;
            }

            removeNode(this._input.parentNode);
            this._input = null;
            this._createInput();

            removeClass(this._button, this._settings.hoverClass);
        },
        /**
         * Function makes sure that when user clicks upload button,
         * the this._input is clicked instead
         */
        _rerouteClicks: function(){
            var self = this;


            addEvent(self._button, 'mouseover', function(){
                if (self._disabled){
                    return;
                }

                if ( ! self._input){
	                self._createInput();
                }

                var div = self._input.parentNode;
                copyLayout(self._button, div);
                div.style.visibility = 'visible';

            });


            /**
             * When the window is resized the elements
             * can be misaligned if button position depends
             * on window size
             */

        },
        /**
         * Creates iframe with unique name
         * @return {Element} iframe
         */
        _createIframe: function(){
            var id = getUID();


            var iframe = toElement('<iframe src="javascript:false;" name="' + id + '" />');
            iframe.setAttribute('id', id);

            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            return iframe;
        },
        /**
         * Creates form, that will be submitted to iframe
         * @param {Element} iframe Where to submit
         * @return {Element} form
         */
        _createForm: function(iframe){
            var settings = this._settings;

            var form = toElement('<form method="post" enctype="multipart/form-data"></form>');

            form.setAttribute('action', settings.action);
            form.setAttribute('target', iframe.name);
            form.style.display = 'none';
            document.body.appendChild(form);

            for (var prop in settings.data) {
                if (settings.data.hasOwnProperty(prop)){
                    var el = document.createElement("input");
                    el.setAttribute('type', 'hidden');
                    el.setAttribute('name', prop);
                    el.setAttribute('value', settings.data[prop]);
                    form.appendChild(el);
                }
            }
            return form;
        },
        /**
         * Gets response from iframe and fires onComplete event when ready
         * @param iframe
         * @param file Filename to use in onComplete callback
         */
        _getResponse : function(iframe, file){
            var toDeleteFlag = false, self = this, settings = this._settings;

            addEvent(iframe, 'load', function(){

                if (// For Safari
                    iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
                    iframe.src == "javascript:'<html></html>';"){

                        if (toDeleteFlag) {
                            setTimeout(function(){
                                removeNode(iframe);
                            }, 0);
                        }

                        return;
                }

                var doc = iframe.contentDocument ? iframe.contentDocument : window.frames[iframe.id].document;

                if (doc.readyState && doc.readyState != 'complete') {
                   return;
                }

                if (doc.body && doc.body.innerHTML == "false") {
                    return;
                }

                var response;

                if (doc.XMLDocument) {
                    response = doc.XMLDocument;
                } else if (doc.body){
                    response = doc.body.innerHTML;

                    if (settings.responseType && settings.responseType.toLowerCase() == 'json') {
                        if (doc.body.firstChild && doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
                            response = doc.body.firstChild.firstChild.nodeValue;
                        }

                        if (response) {
                            response = eval("(" + response + ")");
                        } else {
                            response = {};
                        }
                    }
                } else {
                    response = doc;
                }

                settings.onComplete.call(self, file, response);

                toDeleteFlag = true;

                iframe.src = "javascript:'<html></html>';";
            });
        },
        /**
         * Upload file contained in this._input
         */
        submit: function(){
            var self = this, settings = this._settings;

            if ( ! this._input || this._input.value === ''){
                return;
            }

            var file = fileFromPath(this._input.value);

            if (false === settings.onSubmit.call(this, file, getExt(file))){
                this._clearInput();
                return;
            }

            var iframe = this._createIframe();
            var form = this._createForm(iframe);

            removeNode(this._input.parentNode);
            removeClass(self._button, self._settings.hoverClass);

            form.appendChild(this._input);

            form.submit();

            removeNode(form); form = null;
            removeNode(this._input); this._input = null;

            this._getResponse(iframe, file);

            this._createInput();
        }
    };
})();
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	return function (date, mask, utc) {
		var dF = dateFormat;

		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
if (typeof console == 'undefined'){
  console = {};
  console.info = console.debug = console.warn = console.error = function(){ };
}
function delay(func, timeout) {
  if (func.delayTimeout) clearTimeout(func.delayTimeout);
  func.delayTimeout = setTimeout(func, timeout || 1000);
};
function h(string) {
  return string ? string.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';
}
/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 *
 * Dual licensed under the MIT and GPL licenses
 *
 */
(function ($) {
	var ColorPicker = function () {
		var
			ids = {},
			inAction,
			charMin = 65,
			visible,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview
				};
				$(document).bind('mouseup', current, upIncrement);
				$(document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).unbind('mouseup', upIncrement);
				$(document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upHue);
				$(document).bind('mousemove', current, moveHue);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upHue);
				$(document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upSelector);
				$(document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upSelector);
				$(document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			HexToRGB = function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				if (max != 0) {

				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB = function (hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255-s)*v/255;
					var t3 = (t1-t2)*(h%60)/60;
					if(h==360) h = 0;
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery);
/*
 * Facebox (for jQuery)
 * version: 1.2 (05/05/2008)
 * @requires jQuery v1.2 or later
 *
 * Examples at http://famspam.com/facebox/
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2007, 2008 Chris Wanstrath [ chris@ozmm.org ]
 *
 * Usage:
 *
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox()
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 *
 *    jQuery.facebox('some html')
 *
 *  The above will open a facebox with "some html" as the content.
 *
 *    jQuery.facebox(function($) {
 *      $.get('blah.html', function(data) { $.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page or image:
 *
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ image: 'dude.jpg' })
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 */
(function($) {
  $.facebox = function(data, klass) {
    $.facebox.loading()

    if (data.ajax) fillFaceboxFromAjax(data.ajax)
    else if (data.image) fillFaceboxFromImage(data.image)
    else if (data.div) fillFaceboxFromHref(data.div)
    else if ($.isFunction(data)) data.call($)
    else $.facebox.reveal(data, klass)
  }

  /*
   * Public, $.facebox methods
   */

  $.extend($.facebox, {
    settings: {
      opacity      : 0,
      overlay      : true,
      loadingImage : '/images/facebox/loading.gif',
      closeImage   : '/images/facebox/closelabel.gif', // why is this here if we need to set it manually after?
      imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
      faceboxHtml  : '\
    <div id="facebox" style="display:none;"> \
      <div class="popup"> \
        <table> \
          <tbody> \
            <tr> \
              <td class="tl"/><td class="b"/><td class="tr"/> \
            </tr> \
            <tr> \
              <td class="b"/> \
              <td class="body"> \
                <div class="content"> \
                </div> \
                <div class="footer"> \
                  <a href="#" class="close"> \
                    <img src="/images/facebox/closelabel.gif" title="close" class="close_image" /> \
                  </a> \
                </div> \
              </td> \
              <td class="b"/> \
            </tr> \
            <tr> \
              <td class="bl"/><td class="b"/><td class="br"/> \
            </tr> \
          </tbody> \
        </table> \
      </div> \
    </div>'
    },

    loading: function() {
      init()
      if ($('#facebox .loading').length == 1) return true
      showOverlay()

      $('#facebox .content').empty()
      $('#facebox .body').children().hide().end().
        append('<div class="loading"><img src="'+$.facebox.settings.loadingImage+'"/></div>')

      $('#facebox').css({
        top:	getPageScroll()[1] + (getPageHeight() / 10),
        left:	385.5
      }).show()

      $(document).bind('keydown.facebox', function(e) {
        if (e.keyCode == 27) $.facebox.close()
        return true
      })
      $(document).trigger('loading.facebox')
    },

    reveal: function(data, klass) {
      $(document).trigger('beforeReveal.facebox')
      if (klass) $('#facebox .content').addClass(klass)
      $('#facebox .content').append(data)
      $('#facebox .loading').remove()
      $('#facebox .body').children().fadeIn('normal')
      $('#facebox').css('left', $(window).width() / 2 - ($('#facebox table').width() / 2))
      $(document).trigger('reveal.facebox').trigger('afterReveal.facebox')
    },

    close: function() {
      $(document).trigger('close.facebox')
      return false
    }
  })

  /*
   * Public, $.fn methods
   */

  $.fn.facebox = function(settings) {
    init(settings)

    function clickHandler() {
      $.facebox.loading(true)

      var klass = this.rel.match(/facebox\[?\.(\w+)\]?/)
      if (klass) klass = klass[1]

      fillFaceboxFromHref(this.href, klass)
      return false
    }

    return this.click(clickHandler)
  }

  /*
   * Private methods
   */

  function init(settings) {
    if ($.facebox.settings.inited) return true
    else $.facebox.settings.inited = true

    $(document).trigger('init.facebox')
    makeCompatible()

    var imageTypes = $.facebox.settings.imageTypes.join('|')
    $.facebox.settings.imageTypesRegexp = new RegExp('\.' + imageTypes + '$', 'i')

    if (settings) $.extend($.facebox.settings, settings)
    $('body').append($.facebox.settings.faceboxHtml)

    var preload = [ new Image(), new Image() ]
    preload[0].src = $.facebox.settings.closeImage
    preload[1].src = $.facebox.settings.loadingImage

    $('#facebox').find('.b:first, .bl, .br, .tl, .tr').each(function() {
      preload.push(new Image())
      preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1')
    })

    $('#facebox .close').click($.facebox.close)
    $('#facebox .close_image').attr('src', $.facebox.settings.closeImage)
  }

  function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;
    }
    return new Array(xScroll,yScroll)
  }

  function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {	// all except Explorer
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      windowHeight = document.body.clientHeight;
    }
    return windowHeight
  }

  function makeCompatible() {
    var $s = $.facebox.settings

    $s.loadingImage = $s.loading_image || $s.loadingImage
    $s.closeImage = $s.close_image || $s.closeImage
    $s.imageTypes = $s.image_types || $s.imageTypes
    $s.faceboxHtml = $s.facebox_html || $s.faceboxHtml
  }

  function fillFaceboxFromHref(href, klass) {
    if (href.match(/#/)) {
      var url    = window.location.href.split('#')[0]
      var target = href.replace(url,'')
      $.facebox.reveal($(target).clone().show(), klass)

    } else if (href.match($.facebox.settings.imageTypesRegexp)) {
      fillFaceboxFromImage(href, klass)
    } else {
      fillFaceboxFromAjax(href, klass)
    }
  }

  function fillFaceboxFromImage(href, klass) {
    var image = new Image()
    image.onload = function() {
      $.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', klass)
    }
    image.src = href
  }

  function fillFaceboxFromAjax(href, klass) {
    $.get(href, function(data) { $.facebox.reveal(data, klass) })
  }

  function skipOverlay() {
    return $.facebox.settings.overlay == false || $.facebox.settings.opacity === null
  }

  function showOverlay() {
    if (skipOverlay()) return

    if ($('facebox_overlay').length == 0)
      $("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')

    $('#facebox_overlay').hide().addClass("facebox_overlayBG")
      .css('opacity', $.facebox.settings.opacity)
      .click(function() { $(document).trigger('close.facebox') })
      .fadeIn(200)
    return false
  }

  function hideOverlay() {
    if (skipOverlay()) return

    $('#facebox_overlay').fadeOut(200, function(){
      $("#facebox_overlay").removeClass("facebox_overlayBG")
      $("#facebox_overlay").addClass("facebox_hide")
      $("#facebox_overlay").remove()
    })

    return false
  }

  /*
   * Bindings
   */

  $(document).bind('close.facebox', function() {
    $(document).unbind('keydown.facebox')
    $('#facebox').fadeOut(function() {
      $('#facebox .content').removeClass().addClass('content')
      hideOverlay()
      $('#facebox .loading').remove()
    })
  })

})(jQuery);
(function($){
  $.fn.clonePosition = function(element, options){
    var options = $.extend({
      cloneWidth: true,
      cloneHeight: true,
      offsetLeft: 0,
      offsetTop: 0
    }, (options || {}));

    var offsets = $(element).offset();

    $(this).css({
      position: 'absolute',
      top:  (offsets.top  + options.offsetTop)  + 'px',
      left: (offsets.left + options.offsetLeft) + 'px'
    });

    if (options.cloneWidth)  $(this).width($(element).get(0).offsetWidth);
    if (options.cloneHeight) $(this).height($(element).get(0).offsetHeight);

    return this;
  }
})(jQuery);
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  this.Class = function(){};

  Class.extend = function(prop) {
    var _super = this.prototype;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            this._super = _super[name];

            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    function Class() {
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    Class.prototype = prototype;

    Class.constructor = Class;

    Class.extend = arguments.callee;

    return Class;
  };
})();
/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 1.1.0
 * Date: 26th March 2010
 */

(function($) {

	function getter(plugin, method, args) {
		function getMethods(type) {
			var methods = $[plugin][type] || [];
			return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
		}
		var methods = getMethods('getter');
		return ($.inArray(method, methods) != -1);
	}

	$.fn.jPlayer = function(options) {

		var name = "jPlayer";
		var isMethodCall = (typeof options == 'string');
		var args = Array.prototype.slice.call(arguments, 1);

		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}

		if (isMethodCall && getter(name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args) : undefined);
		}

		return this.each(function() {
			var instance = $.data(this, name);

			if(!instance && !isMethodCall) {
				$.data(this, name, new $[name](this, options))._init();
			}

			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};

	$.jPlayer = function(element, options) {
		this.options = $.extend({}, options);
		this.element = $(element);
	};

	$.jPlayer.getter = "jPlayerOnProgressChange jPlayerOnSoundComplete jPlayerVolume jPlayerReady getData jPlayerController";

	$.jPlayer.defaults = {
		cssPrefix: "jqjp",
		swfPath: "flash",
		volume: 80,
		oggSupport: false,
		nativeSupport: true,
		customCssIds: false,
		graphicsFix: true,
		errorAlerts: false,
		warningAlerts: false,
		position: "absolute",
		width: "0",
		height: "0",
		top: "0",
		left: "0",
		quality: "high",
		bgcolor: "#ffffff"
	};

	$.jPlayer._config = {
		version: "1.1.0",
		swfVersionRequired: "1.1.0",
		swfVersion: "unknown",
		jPlayerControllerId: undefined,
		delayedCommandId: undefined,
		isWaitingForPlay:false,
		isFileSet:false
	};

	$.jPlayer._diag = {
		isPlaying: false,
		src: "",
		loadPercent: 0,
		playedPercentRelative: 0,
		playedPercentAbsolute: 0,
		playedTime: 0,
		totalTime: 0
	};

	$.jPlayer._cssId = {
		play: "jplayer_play",
		pause: "jplayer_pause",
		stop: "jplayer_stop",
		loadBar: "jplayer_load_bar",
		playBar: "jplayer_play_bar",
		volumeMin: "jplayer_volume_min",
		volumeMax: "jplayer_volume_max",
		volumeBar: "jplayer_volume_bar",
		volumeBarValue: "jplayer_volume_bar_value"
	};

	$.jPlayer.count = 0;

	$.jPlayer.timeFormat = {
		showHour: false,
		showMin: true,
		showSec: true,
		padHour: false,
		padMin: true,
		padSec: true,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};

	$.jPlayer.convertTime = function(mSec) {
		var myTime = new Date(mSec);
		var hour = myTime.getUTCHours();
		var min = myTime.getUTCMinutes();
		var sec = myTime.getUTCSeconds();
		var strHour = ($.jPlayer.timeFormat.padHour && hour < 10) ? "0" + hour : hour;
		var strMin = ($.jPlayer.timeFormat.padMin && min < 10) ? "0" + min : min;
		var strSec = ($.jPlayer.timeFormat.padSec && sec < 10) ? "0" + sec : sec;
		return (($.jPlayer.timeFormat.showHour) ? strHour + $.jPlayer.timeFormat.sepHour : "") + (($.jPlayer.timeFormat.showMin) ? strMin + $.jPlayer.timeFormat.sepMin : "") + (($.jPlayer.timeFormat.showSec) ? strSec + $.jPlayer.timeFormat.sepSec : "");
	};

	$.jPlayer.prototype = {
		_init: function() {
			var self = this;
			var element = this.element;

			this.config = $.extend({}, $.jPlayer.defaults, this.options, $.jPlayer._config);
			this.config.diag = $.extend({}, $.jPlayer._diag);
			this.config.cssId = {};
			this.config.cssSelector = {};
			this.config.cssDisplay = {};
			this.config.clickHandler = {};

			this.element.data("jPlayer.config", this.config);

			$.extend(this.config, {
				id: this.element.attr("id"),
				swf: this.config.swfPath + ((this.config.swfPath != "" && this.config.swfPath.slice(-1) != "/") ? "/" : "") + "Jplayer.swf",
				fid: this.config.cssPrefix + "_flash_" + $.jPlayer.count,
				aid: this.config.cssPrefix + "_audio_" + $.jPlayer.count,
				hid: this.config.cssPrefix + "_force_" + $.jPlayer.count,
				i: $.jPlayer.count,
				volume: this._limitValue(this.config.volume, 0, 100)
			});

			$.jPlayer.count++;

			if(this.config.ready != undefined) {
				if($.isFunction(this.config.ready)) {
					this.jPlayerReadyCustom = this.config.ready;
				} else {
					this._warning("Constructor's ready option is not a function.");
				}
			}

			try {
				this.config.audio = new Audio();
				this.config.audio.id = this.config.aid;
				this.element.append(this.config.audio);
			} catch(err) {
				this.config.audio = {};
			}

			$.extend(this.config, {
				canPlayMP3: !!((this.config.audio.canPlayType) ? (("" != this.config.audio.canPlayType("audio/mpeg")) && ("no" != this.config.audio.canPlayType("audio/mpeg"))) : false),
				canPlayOGG: !!((this.config.audio.canPlayType) ? (("" != this.config.audio.canPlayType("audio/ogg")) && ("no" != this.config.audio.canPlayType("audio/ogg"))) : false),
				aSel: $("#" + this.config.aid)
			});

			$.extend(this.config, {
				html5: !!((this.config.oggSupport) ? ((this.config.canPlayOGG) ? true : this.config.canPlayMP3) : this.config.canPlayMP3)
			});

			$.extend(this.config, {
				usingFlash: !(this.config.html5 && this.config.nativeSupport),
				usingMP3: !(this.config.oggSupport && this.config.canPlayOGG && this.config.nativeSupport)
			});

			var events = {
				setButtons: function(e, playing) {
					self.config.diag.isPlaying = playing;
					if(self.config.cssId.play != undefined && self.config.cssId.pause != undefined) {
						if(playing) {
							self.config.cssSelector.play.css("display", "none");
							self.config.cssSelector.pause.css("display", self.config.cssDisplay.pause);
						} else {
							self.config.cssSelector.play.css("display", self.config.cssDisplay.play);
							self.config.cssSelector.pause.css("display", "none");
						}
					}
					if(playing) {
						self.config.isWaitingForPlay = false;
					}

				}
			};

			var eventsForFlash = {
				setFile: function(e, mp3, ogg) {
					try {
						self._getMovie().fl_setFile_mp3(mp3);
						self.config.diag.src = mp3;
						self.config.isFileSet = true; // Set here for conformity, but the flash handles this internally and through return values.
						element.trigger("jPlayer.setButtons", false);
					} catch(err) { self._flashError(err); }
				},
				clearFile: function(e) {
					try {
						element.trigger("jPlayer.setButtons", false); // Before flash method so states correct for when onProgressChange is called
						self._getMovie().fl_clearFile_mp3();
						self.config.diag.src = "";
						self.config.isFileSet = false;
					} catch(err) { self._flashError(err); }
				},
				play: function(e) {
					try {
						if(self._getMovie().fl_play_mp3()) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				pause: function(e) {
					try {
						if(self._getMovie().fl_pause_mp3()) {
							element.trigger("jPlayer.setButtons", false);
						}
					} catch(err) { self._flashError(err); }
				},
				stop: function(e) {
					try {
						if(self._getMovie().fl_stop_mp3()) {
							element.trigger("jPlayer.setButtons", false);
						}
					} catch(err) { self._flashError(err); }
				},
				playHead: function(e, p) {
					try {
						if(self._getMovie().fl_play_head_mp3(p)) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				playHeadTime: function(e, t) {
					try {
						if(self._getMovie().fl_play_head_time_mp3(t)) {
							element.trigger("jPlayer.setButtons", true);
						}
					} catch(err) { self._flashError(err); }
				},
				volume: function(e, v) {
					self.config.volume = v;
					try {
						self._getMovie().fl_volume_mp3(v);
					} catch(err) { self._flashError(err); }
				}
			};

			var eventsForHtmlAudio = {
				setFile: function(e, mp3, ogg) {
					self.config.audio = new Audio();
					self.config.audio.id = self.config.aid;
					self.config.aSel.replaceWith(self.config.audio);
					self.config.aSel = $("#"+self.config.aid);
					if(self.config.usingMP3) {
						self.config.diag.src = mp3;
					} else {
						self.config.diag.src = ogg;
					}
					self.config.isWaitingForPlay = true;
					self.config.isFileSet = true;
					element.trigger("jPlayer.setButtons", false);
					self.jPlayerOnProgressChange(0, 0, 0, 0, 0);
					clearInterval(self.config.jPlayerControllerId);
					self.config.audio.addEventListener("canplay", function() {
						self.config.audio.volume = self.config.volume/100; // Fix for Chrome 4: Event solves initial volume not being set correctly.
					}, false);
				},
				clearFile: function(e) {
					self.setFile("","");
					self.config.isWaitingForPlay = false;
					self.config.isFileSet = false;
				},
				play: function(e) {
					if(self.config.isFileSet) {
						if(self.config.isWaitingForPlay) {
							self.config.audio.src = self.config.diag.src;
						}
						self.config.audio.play();
						element.trigger("jPlayer.setButtons", true);
						clearInterval(self.config.jPlayerControllerId);
						self.config.jPlayerControllerId = window.setInterval( function() {
							self.jPlayerController(false);
						}, 100);
						clearInterval(self.config.delayedCommandId);
					}
				},
				pause: function(e) {
					if(self.config.isFileSet) {
						self.config.audio.pause();
						element.trigger("jPlayer.setButtons", false);
					}
				},
				stop: function(e) {
					if(self.config.isFileSet) {
						try {
							self.config.audio.currentTime = 0;
							element.trigger("jPlayer.pause");
							clearInterval(self.config.jPlayerControllerId);
							self.config.jPlayerControllerId = window.setInterval( function() {
								self.jPlayerController(true); // With override true
							}, 100);

						} catch(err) {
							clearInterval(self.config.delayedCommandId);
							self.config.delayedCommandId = window.setTimeout(function() {
								self.stop();
							}, 100);
						}
					}
				},
				playHead: function(e, p) {
					if(self.config.isFileSet) {
						try {
							if((typeof self.config.audio.buffered == "object") && (self.config.audio.buffered.length > 0)) {
								self.config.audio.currentTime = p * self.config.audio.buffered.end(self.config.audio.buffered.length-1) / 100;
							} else {
								self.config.audio.currentTime = p * self.config.audio.duration / 100;
							}
							element.trigger("jPlayer.play");
						} catch(err) {
							clearInterval(self.config.delayedCommandId);
							self.config.delayedCommandId = window.setTimeout(function() {
								self.playHead(p);
							}, 100);
						}
					}
				},
				playHeadTime: function(e, t) {
					if(self.config.isFileSet) {
						try {
							self.config.audio.currentTime = t/1000;
							element.trigger("jPlayer.play");
						} catch(err) {
							clearInterval(self.config.delayedCommandId);
							self.config.delayedCommandId = window.setTimeout(function() {
								self.playHeadTime(t);
							}, 100);
						}
					}
				},
				volume: function(e, v) {
					self.config.volume = v;
					self.config.audio.volume = v/100;
					self.jPlayerVolume(v);
				}
			};

			if(this.config.usingFlash) {
				$.extend(events, eventsForFlash);
			} else {
				$.extend(events, eventsForHtmlAudio);
			}

			for(var event in events) {
				var e = "jPlayer." + event;
				this.element.unbind(e);
				this.element.bind(e, events[event]);
			}

			if(this.config.usingFlash) {
				if(this._checkForFlash(8)) {
					if($.browser.msie) {
						var html_obj = '<object id="' + this.config.fid + '"';
						html_obj += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
						html_obj += ' codebase="' + document.URL.substring(0,document.URL.indexOf(':')) + '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"'; // Fixed IE non secured element warning.
						html_obj += ' type="application/x-shockwave-flash"';
						html_obj += ' width="' + this.config.width + '" height="' + this.config.height + '">';
						html_obj += '</object>';

						var obj_param = new Array();
						obj_param[0] = '<param name="movie" value="' + this.config.swf + '" />';
						obj_param[1] = '<param name="quality" value="high" />';
						obj_param[2] = '<param name="FlashVars" value="id=' + escape(this.config.id) + '&fid=' + escape(this.config.fid) + '&vol=' + this.config.volume + '" />';
						obj_param[3] = '<param name="allowScriptAccess" value="always" />';
						obj_param[4] = '<param name="bgcolor" value="' + this.config.bgcolor + '" />';

						var ie_dom = document.createElement(html_obj);
						for(var i=0; i < obj_param.length; i++) {
							ie_dom.appendChild(document.createElement(obj_param[i]));
						}
						this.element.html(ie_dom);
					} else {
						var html_embed = '<embed name="' + this.config.fid + '" id="' + this.config.fid + '" src="' + this.config.swf + '"';
						html_embed += ' width="' + this.config.width + '" height="' + this.config.height + '" bgcolor="' + this.config.bgcolor + '"';
						html_embed += ' quality="high" FlashVars="id=' + escape(this.config.id) + '&fid=' + escape(this.config.fid) + '&vol=' + this.config.volume + '"';
						html_embed += ' allowScriptAccess="always"';
						html_embed += ' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
						this.element.html(html_embed);
					}

				} else {
					this.element.html("<p>Flash 8 or above is not installed. <a href='http://get.adobe.com/flashplayer'>Get Flash!</a></p>");
				}
			}

			this.element.css({'position':this.config.position, 'top':this.config.top, 'left':this.config.left});

			if(this.config.graphicsFix) {
				var html_hidden = '<div id="' + this.config.hid + '"></div>';
				this.element.append(html_hidden);

				$.extend(this.config, {
					hSel: $("#"+this.config.hid)
				});
				this.config.hSel.css({'text-indent':'-9999px'});
			}

			if(!this.config.customCssIds) {
				$.each($.jPlayer._cssId, function(name, id) {
					self.cssId(name, id);
				});
			}

			if(!this.config.usingFlash) { // Emulate initial flash call after 100ms
				this.element.css({'left':'-9999px'}); // Mobile Safari always shows the <audio> controls, so hide them.
				window.setTimeout( function() {
					self.volume(self.config.volume);
					self.jPlayerReady();
				}, 100);
			}
		},
		jPlayerReady: function(swfVersion) { // Called from Flash / HTML5 interval
			if(this.config.usingFlash) {
				this.config.swfVersion = swfVersion;
				if(this.config.swfVersionRequired != this.config.swfVersion) {
					this._error("jPlayer's JavaScript / SWF version mismatch!\n\nJavaScript requires SWF : " + this.config.swfVersionRequired + "\nThe Jplayer.swf used is : " + this.config.swfVersion);
				}
			} else {
				this.config.swfVersion = "n/a";
			}
			this.jPlayerReadyCustom();
		},
		jPlayerReadyCustom: function() {
		},
		setFile: function(mp3, ogg) {
			this.element.trigger("jPlayer.setFile", [mp3, ogg]);
		},
		clearFile: function() {
			this.element.trigger("jPlayer.clearFile");
		},
		play: function() {
			this.element.trigger("jPlayer.play");
		},
		pause: function() {
			this.element.trigger("jPlayer.pause");
		},
		stop: function() {
			this.element.trigger("jPlayer.stop");
		},
		playHead: function(p) {
			this.element.trigger("jPlayer.playHead", [p]);
		},
		playHeadTime: function(t) {
			this.element.trigger("jPlayer.playHeadTime", [t]);
		},
		volume: function(v) {
			v = this._limitValue(v, 0, 100);
			this.element.trigger("jPlayer.volume", [v]);
		},
		cssId: function(fn, id) {
			var self = this;
			if(typeof id == 'string') {
				if($.jPlayer._cssId[fn]) {
					if(this.config.cssId[fn] != undefined) {
						this.config.cssSelector[fn].unbind("click", this.config.clickHandler[fn]);
					}
					this.config.cssId[fn] = id;
					this.config.cssSelector[fn] = $("#"+id);
					this.config.clickHandler[fn] = function(e) {
						self[fn](e);
						return false;
					}
					this.config.cssSelector[fn].click(this.config.clickHandler[fn]);
					this.config.cssDisplay[fn] = this.config.cssSelector[fn].css("display");
					if(fn == "pause") {
						this.config.cssSelector[fn].css("display", "none");
					}
				} else {
					this._warning("Unknown/Illegal function in cssId\n\njPlayer('cssId', '"+fn+"', '"+id+"')");
				}
			} else {
				this._warning("cssId CSS Id must be a string\n\njPlayer('cssId', '"+fn+"', "+id+")");
			}
		},
		loadBar: function(e) { // Handles clicks on the loadBar
			if( this.config.cssId.loadBar != undefined ) {
				var offset = this.config.cssSelector.loadBar.offset();
				var x = e.pageX - offset.left;
				var w = this.config.cssSelector.loadBar.width();
				var p = 100*x/w;
				this.playHead(p);
			}
		},
		playBar: function(e) { // Handles clicks on the playBar
			this.loadBar(e);
		},
		onProgressChange: function(fn) {
			if($.isFunction(fn)) {
				this.onProgressChangeCustom = fn;
			} else {
				this._warning("onProgressChange parameter is not a function.");
			}
		},
		onProgressChangeCustom: function() {
		},
		jPlayerOnProgressChange: function(lp, ppr, ppa, pt, tt) { // Called from Flash / HTML5 interval
			this.config.diag.loadPercent = lp;
			this.config.diag.playedPercentRelative = ppr;
			this.config.diag.playedPercentAbsolute = ppa;
			this.config.diag.playedTime = pt;
			this.config.diag.totalTime = tt;

			if (this.config.cssId.loadBar != undefined) {
				this.config.cssSelector.loadBar.width(lp+"%");
			}
			if (this.config.cssId.playBar != undefined ) {
				this.config.cssSelector.playBar.width(ppr+"%");
			}

			this.onProgressChangeCustom(lp, ppr, ppa, pt, tt);
			this._forceUpdate();
		},
		jPlayerController: function(override) { // The HTML5 interval function.
			var pt = 0, tt = 0, ppa = 0, lp = 0, ppr = 0;
			if(this.config.audio.readyState >= 1) {
				pt = this.config.audio.currentTime * 1000; // milliSeconds
				tt = this.config.audio.duration * 1000; // milliSeconds
				tt = isNaN(tt) ? 0 : tt; // Clean up duration in Firefox 3.5+
				ppa = (tt > 0) ? 100 * pt / tt : 0;
				if((typeof this.config.audio.buffered == "object") && (this.config.audio.buffered.length > 0)) {
					lp = 100 * this.config.audio.buffered.end(this.config.audio.buffered.length-1) / this.config.audio.duration;
					ppr = 100 * this.config.audio.currentTime / this.config.audio.buffered.end(this.config.audio.buffered.length-1);
				} else {
					lp = 100;
					ppr = ppa;
				}
			}

			if (this.config.audio.ended) {
				clearInterval(this.config.jPlayerControllerId);
				this.jPlayerOnSoundComplete();
			} else if(!this.config.diag.isPlaying && lp >= 100) {
				clearInterval(this.config.jPlayerControllerId);
			}

			if(override) {
				this.jPlayerOnProgressChange(lp, 0, 0, 0, tt);
			} else {
				this.jPlayerOnProgressChange(lp, ppr, ppa, pt, tt);
			}
		},
		volumeMin: function() {
			this.volume(0);
		},
		volumeMax: function() {
			this.volume(100);
		},
		volumeBar: function(e) { // Handles clicks on the volumeBar
			if( this.config.cssId.volumeBar != undefined ) {
				var offset = this.config.cssSelector.volumeBar.offset();
				var x = e.pageX - offset.left;
				var w = this.config.cssSelector.volumeBar.width();
				var p = 100*x/w;
				this.volume(p);
			}
		},
		volumeBarValue: function(e) { // Handles clicks on the volumeBarValue
			this.volumeBar(e);
		},
		jPlayerVolume: function(v) { // Called from Flash / HTML5 event
			if( this.config.cssId.volumeBarValue != null ) {
				this.config.cssSelector.volumeBarValue.width(v+"%");
				this._forceUpdate();
			}
		},
		onSoundComplete: function(fn) {
			if($.isFunction(fn)) {
				this.onSoundCompleteCustom = fn;
			} else {
				this._warning("onSoundComplete parameter is not a function.");
			}
		},
		onSoundCompleteCustom: function() {
		},
		jPlayerOnSoundComplete: function() { // Called from Flash / HTML5 interval
			this.element.trigger("jPlayer.setButtons", false);
			this.onSoundCompleteCustom();
		},
		getData: function(name) {
			var n = name.split(".");
			var p = this.config;
			for(var i = 0; i < n.length; i++) {
				if(p[n[i]] != undefined) {
					p = p[n[i]];
				} else {
					this._warning("Undefined data requested.\n\njPlayer('getData', '" + name + "')");
					return undefined;
				}
			}
			return p;
		},
		_getMovie: function() {
			return document[this.config.fid];
		},
		_checkForFlash: function (version){
			var flashIsInstalled = false;
			var flash;
			if(window.ActiveXObject){
				try{
					flash = new ActiveXObject(("ShockwaveFlash.ShockwaveFlash." + version));
					flashIsInstalled = true;
				}
				catch(e){
				}
			}
			else if(navigator.plugins && navigator.mimeTypes.length > 0){
				flash = navigator.plugins["Shockwave Flash"];
				if(flash){
					var flashVersion = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1");
					if(flashVersion >= version){
						flashIsInstalled = true;
					}
				}
			}
			return flashIsInstalled;
		},
		_forceUpdate: function() { // For Safari and Chrome
			if(this.config.graphicsFix) {
				this.config.hSel.text(""+Math.random());
			}
		},
		_limitValue: function(value, min, max) {
			return (value < min) ? min : ((value > max) ? max : value);
		},
		_flashError: function(e) {
			this._error("Problem with Flash component.\n\nCheck the swfPath points at the Jplayer.swf path.\n\nswfPath = " + this.config.swfPath + "\nurl: " + this.config.swf + "\n\nError: " + e.message);
		},
		_error: function(msg) {
			if(this.config.errorAlerts) {
				this._alert("Error!\n\n" + msg);
			}
		},
		_warning: function(msg) {
			if(this.config.warningAlerts) {
				this._alert("Warning!\n\n" + msg);
			}
		},
		_alert: function(msg) {
			alert("jPlayer " + this.config.version + " : id='" + this.config.id +"' : " + msg);
		}
	};
})(jQuery);
/*! Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.2
 *
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
	setup: function() {
		if ( this.addEventListener )
			for ( var i=types.length; i; )
				this.addEventListener( types[--i], handler, false );
		else
			this.onmousewheel = handler;
	},

	teardown: function() {
		if ( this.removeEventListener )
			for ( var i=types.length; i; )
				this.removeEventListener( types[--i], handler, false );
		else
			this.onmousewheel = null;
	}
};

$.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},

	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});


function handler(event) {
	var args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true;

	event = $.event.fix(event || window.event);
	event.type = "mousewheel";

	if ( event.wheelDelta ) delta = event.wheelDelta/120;
	if ( event.detail     ) delta = -event.detail/3;

	args.unshift(event, delta);

	return $.event.handle.apply(this, args);
}

})(jQuery);
(function($){
  var replacer = function(finder, replacement, element) {
    if (!finder || typeof replacement === 'undefined') {
      return
    }
    var regex = (typeof finder == 'string') ? new RegExp(finder, 'g') : finder;

    var childNodes = element.childNodes;
    var len = childNodes.length;

    while (len--) {
      var node = childNodes[len];

      if (node.nodeType === 1 && ('html,head,style,title,link,meta,script,object,iframe,pre,a,'.indexOf(node.nodeName.toLowerCase()) === -1)) {
        replacer(finder, replacement, node);
      }

      if (node.nodeType !== 3 || !regex.test(node.data)) {
        continue;
      }

      var frag = (function(){
        var html = node.data.replace(regex, replacement);
        var wrap = document.createElement('span');
        var frag = document.createDocumentFragment();

        wrap.innerHTML = html;

        while (wrap.firstChild) {
          frag.appendChild(wrap.firstChild);
        }

        return frag;
      })();

      var parent = node.parentNode;
      parent.insertBefore(frag, node);
      parent.removeChild(node);
    }
  }

  $.fn.replace = function(finder, replacement) {
    return this.each(function(){
      replacer(finder, replacement, $(this).get(0));
    });
  }
})(jQuery);

jQuery.fn.extend({
	everyTime: function(interval, label, fn, times) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.extend({
	timer: {
		global: [],
		guid: 1,
		dataKey: "jQuery.timer",
		regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
		powers: {
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times) {
			var counter = 0;

			if (jQuery.isFunction(label)) {
				if (!times)
					times = fn;
				fn = label;
				label = interval;
			}

			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval < 0)
				return;

			if (typeof times != 'number' || isNaN(times) || times < 0)
				times = 0;

			times = times || 0;

			var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

			if (!timers[label])
				timers[label] = {};

			fn.timerID = fn.timerID || this.guid++;

			var handler = function() {
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
			};

			handler.timerID = fn.timerID;

			if (!timers[label][fn.timerID])
				timers[label][fn.timerID] = window.setInterval(handler,interval);

			this.global.push( element );

		},
		remove: function(element, label, fn) {
			var timers = jQuery.data(element, this.dataKey), ret;

			if ( timers ) {

				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.timerID ) {
							window.clearInterval(timers[label][fn.timerID]);
							delete timers[label][fn.timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}

					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}

				for ( ret in timers ) break;
				if ( !ret )
					jQuery.removeData(element, this.dataKey);
			}
		}
	}
});

jQuery(window).bind("unload", function() {
	jQuery.each(jQuery.timer.global, function(index, item) {
		jQuery.timer.remove(item);
	});
});
/*
Script: JSONError.js

Dedicated JSON Error object:


Version:
        1.0 - Too much simple to be unstable ;)

Compatibility:
        FireFox - Version 1, 1.5, 2 and 3 (FireFox uses secure code evaluation)
        Internet Explorer - Version 5, 5.5, 6 and 7
        Opera - 8 and 9 (probably 7 too)
        Safari - Version 2 (probably 1 too)
        Konqueror - Version 3 or greater

Author:
        Andrea Giammarchi, <http://www.3site.eu>

License:
        >Copyright (C) 2007 Andrea Giammarchi - www.3site.eu
        >
        >Permission is hereby granted, free of charge,
        >to any person obtaining a copy of this software and associated
        >documentation files (the "Software"),
        >to deal in the Software without restriction,
        >including without limitation the rights to use, copy, modify, merge,
        >publish, distribute, sublicense, and/or sell copies of the Software,
        >and to permit persons to whom the Software is furnished to do so,
        >subject to the following conditions:
        >
        >The above copyright notice and this permission notice shall be included
        >in all copies or substantial portions of the Software.
        >
        >THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
        >INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        >FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        >IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        >DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
        >ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
        >OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
Object: JSONError
        Extends object Error

Example:
        >try{
        >       throw new JSONError("bad data");
        >}
        >catch(e) {
        >       alert(e);
        >       // JSONError: bad data
        >}
*/
function JSONError(message){

        /* Section: Properties - Public */

        /*
        Property: message
                String - Error message or empty string
        */
        this.message = message || "";

        /*
        Property: name
                String - object name: JSONError
        */
        this.name = "JSONError";
};
JSONError.prototype = new Error;

/*
Script: JSON.js

JSON encoder / decoder:
	This object uses good practices to encode/decode quikly and a bit safer(*) every kind of JSON compatible variable.

	(*) Please read more about JSON and Ajax JavaScript Hijacking problems, <http://www.fortifysoftware.com/advisory.jsp>

	To download last version of this script use this link: <http://www.devpro.it/code/149.html>

Version:
	1.3b - modified toDate method, now compatible with milliseconds time too (time or milliseconds/1000)

Compatibility:
	FireFox - Version 1, 1.5, 2 and 3 (FireFox uses secure code evaluation)
	Internet Explorer - Version 5, 5.5, 6 and 7
	Opera - 8 and 9 (probably 7 too)
	Safari - Version 2 (probably 1 too)
	Konqueror - Version 3 or greater

Dependencies:
	<JSONError.js>

Credits:
	- JSON site for safe RegExp and generic JSON informations, <http://www.json.org/>
	- kenta for safe evaluation idea, <http://mykenta.blogspot.com/>

Author:
	Andrea Giammarchi, <http://www.3site.eu>

License:
	>Copyright (C) 2007 Andrea Giammarchi - www.3site.eu
	>
	>Permission is hereby granted, free of charge,
	>to any person obtaining a copy of this software and associated
	>documentation files (the "Software"),
	>to deal in the Software without restriction,
	>including without limitation the rights to use, copy, modify, merge,
	>publish, distribute, sublicense, and/or sell copies of the Software,
	>and to permit persons to whom the Software is furnished to do so,
	>subject to the following conditions:
	>
	>The above copyright notice and this permission notice shall be included
	>in all copies or substantial portions of the Software.
	>
	>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
	>INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
	>IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	>DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	>ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
	>OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
Object: JSON
	Stand alone or prototyped encode, decode or toDate public methods.

Example:
	>alert(JSON.encode([0,1,false,true,null,[2,3],{"some":"value"}]));
	>// [0,1,false,true,null,[2,3],{"some":"value"}]
	>
	>alert(JSON.decode('[0,1,false,true,null,[2,3],{"some":"value"}]'))
	>// 0,1,false,true,,2,3,[object Object]
*/
JSON = new function(){

	/* Section: Methods - Public */

	/*
	Method: decode
		decodes a valid JSON encoded string.

	Arguments:
		[String / Function] - Optional JSON string to decode or a filter function if method is a String prototype.
		[Function] - Optional filter function if first argument is a JSON string and this method is not a String prototype.

	Returns:
		Object - Generic JavaScript variable or undefined

	Example [Basic]:
		>var	arr = JSON.decode('[1,2,3]');
		>alert(arr);	// 1,2,3
		>
		>arr = JSON.decode('[1,2,3]', function(key, value){return key * value});
		>alert(arr);	// 0,2,6

	Example [Prototype]:
		>String.prototype.parseJSON = JSON.decode;
		>
		>alert('[1,2,3]'.parseJSON());	// 1,2,3
		>
		>try {
		>	alert('[1,2,3]'.parseJSON(function(key, value){return key * value}));
		>	// 0,2,6
		>}
		>catch(e) {
		>	alert(e.message);
		>}

	Note:
		Internet Explorer 5 and other old browsers should use a different regular expression to check if a JSON string is valid or not.
		This old browsers dedicated RegExp is not safe as native version is but it required for compatibility.
	*/
	this.decode = function(){
		var	filter, result, self, tmp;
		if($$("toString")) {
			switch(arguments.length){
				case	2:
					self = arguments[0];
					filter = arguments[1];
					break;
				case	1:
					if($[typeof arguments[0]](arguments[0]) === Function) {
						self = this;
						filter = arguments[0];
					}
					else
						self = arguments[0];
					break;
				default:
					self = this;
					break;
			};
			if(rc.test(self)){
				try{
					result = e("(".concat(self, ")"));
					if(filter && result !== null && (tmp = $[typeof result](result)) && (tmp === Array || tmp === Object)){
						for(self in result)
							result[self] = v(self, result) ? filter(self, result[self]) : result[self];
					}
				}
				catch(z){}
			}
			else {
				throw new JSONError("bad data");
			}
		};
		return result;
	};

	/*
	Method: encode
		encode a generic JavaScript variable into a valid JSON string.

	Arguments:
		[Object] - Optional generic JavaScript variable to encode if method is not an Object prototype.

	Returns:
		String - Valid JSON string or undefined

	Example [Basic]:
		>var	s = JSON.encode([1,2,3]);
		>alert(s);	// [1,2,3]

	Example [Prototype]:
		>Object.prototype.toJSONString = JSON.encode;
		>
		>alert([1,2,3].toJSONString());	// [1,2,3]
	*/
	this.encode = function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = $[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = JSON.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', d(self.getMonth() + 1), '-', d(self.getDate()), 'T', d(self.getHours()), ':', d(self.getMinutes()), ':', d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(rs, s).replace(ru, u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = JSON.encode(self[key])))
							result[i++] = '"'.concat(key.replace(rs, s).replace(ru, u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	};

	/*
	Method: toDate
		transforms a JSON encoded Date string into a native Date object.

	Arguments:
		[String/Number] - Optional JSON Date string or server time if this method is not a String prototype. Server time should be an integer, based on seconds since 1970/01/01 or milliseconds / 1000 since 1970/01/01.

	Returns:
		Date - Date object or undefined if string is not a valid Date

	Example [Basic]:
		>var	serverDate = JSON.toDate("2007-04-05T08:36:46");
		>alert(serverDate.getMonth());	// 3 (months start from 0)

	Example [Prototype]:
		>String.prototype.parseDate = JSON.toDate;
		>
		>alert("2007-04-05T08:36:46".parseDate().getDate());	// 5

	Example [Server Time]:
		>var	phpServerDate = JSON.toDate(<?php echo time(); ?>);
		>var	csServerDate = JSON.toDate(<%#(DateTime.Now.Ticks/10000-62135596800000)%>/1000);

	Example [Server Time Prototype]:
		>Number.prototype.parseDate = JSON.toDate;
		>var	phpServerDate = (<?php echo time(); ?>).parseDate();
		>var	csServerDate = (<%#(DateTime.Now.Ticks/10000-62135596800000)%>/1000).parseDate();

	Note:
		This method accepts an integer or numeric string too to mantain compatibility with generic server side time() function.
		You can convert quickly mtime, ctime, time and other time based values.
		With languages that supports milliseconds you can send total milliseconds / 1000 (time is set as time * 1000)
	*/
	this.toDate = function(){
		var	self = arguments.length ? arguments[0] : this,
			result;
		if(rd.test(self)){
			result = new Date;
			result.setHours(i(self, 11, 2));
			result.setMinutes(i(self, 14, 2));
			result.setSeconds(i(self, 17, 2));
			result.setMonth(i(self, 5, 2) - 1);
			result.setDate(i(self, 8, 2));
			result.setFullYear(i(self, 0, 4));
		}
		else if(rt.test(self))
			result = new Date(self * 1000);
		return result;
	};

	/* Section: Properties - Private */

	/*
	Property: Private

	List:
		Object - 'c' - a dictionary with useful keys / values for fast encode convertion
		Function - 'd' - returns decimal string rappresentation of a number ("14", "03", etc)
		Function - 'e' - safe and native code evaulation
		Function - 'i' - returns integer from string ("01" => 1, "15" => 15, etc)
		Array - 'p' - a list with different "0" strings for fast special chars escape convertion
		RegExp - 'rc' - regular expression to check JSON strings (different for IE5 or old browsers and new one)
		RegExp - 'rd' - regular expression to check a JSON Date string
		RegExp - 'rs' - regular expression to check string chars to modify using c (char) values
		RegExp - 'rt' - regular expression to check integer numeric string (for toDate time version evaluation)
		RegExp - 'ru' - regular expression to check string chars to escape using "\u" prefix
		Function - 's' - returns escaped string adding "\\" char as prefix ("\\" => "\\\\", etc.)
		Function - 'u' - returns escaped string, modifyng special chars using "\uNNNN" notation
		Function - 'v' - returns boolean value to skip object methods or prototyped parameters (length, others), used for optional decode filter function
		Function - '$' - returns object constructor if it was not cracked (someVar = {}; someVar.constructor = String <= ignore them)
		Function - '$$' - returns boolean value to check native Array and Object constructors before convertion
	*/
	var	c = {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
		d = function(n){return n<10?"0".concat(n):n},
		e = function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
		i = function(e,p,l){return 1*e.substr(p,l)},
		p = ["","000","00","0",""],
		rc = null,
		rd = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
		rs = /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
		rt = /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
		ru = /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
		s = function(i,d){return "\\".concat(c[d])},
		u = function(i,d){
			var	n=d.charCodeAt(0).toString(16);
			return "\\u".concat(p[n.length],n)
		},
		v = function(k,v){return $[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
		$ = {
			"boolean":function(){return Boolean},
			"function":function(){return Function},
			"number":function(){return Number},
			"object":function(o){return o instanceof o.constructor?o.constructor:null},
			"string":function(){return String},
			"undefined":function(){return null}
		},
		$$ = function(m){
			function $(c,t){t=c[m];delete c[m];try{e(c)}catch(z){c[m]=t;return 1}};
			return $(Array)&&$(Object)
		};
	try{rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
	catch(z){rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
};

function MD5(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}

	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}

 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }

	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}

	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

	return temp.toLowerCase();
}
/**
 * notifyLibJS.js - Version 1.1
 * Last update: 07-07-09
 *
 * Unified notifications library to handle Growl notifications across all
 * available platforms — Safari (with Growler), Firefox (with Yip), Fluid and Prism
 *
 * @author Aditya Mukherjee - aditya@adityamukherjee.com
 * thanks to Leonid Khachaturov (http://github.com/Leonya)
 *
 * @license modified MIT License

Copyright (c) 2009 Aditya Mukherjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */

(function(){
  if(navigator.userAgent.indexOf('Safari') != -1){
    if(!window.fluid){//this isn't Fluid
      for(var i=0, growler = false;i<navigator.plugins.length;i++){//check if Growler plug-in is installed
        if(navigator.plugins[i].name == 'Growler'){
          window.addEventListener('load', function(){
            var e = document.createElement('embed');
            e.type = 'application/x-growl';
            e.name = 'Growler';
            e.width = '0';
            e.height = '0';
            document.body.appendChild(e);
          }, true);
          break;
        }
      }
    }
  }

  if(!window.notifications){
    var notifications = {
      prism: !!(window.platform && window.platform.showNotification), //this is Firefox/Prism
      fluid: !!(window.fluid || document.embeds.Growler), // this is WebKit/Fluid
      growler: !!(document.embeds.Growler || window.growler),
      notifications_support: function(){ return !!(this.prism || this.fluid)},
      notify: function(values){
        var args = {
          title: (values.title) ? values.title : document.title,
          description: (values.description) ? values.description : "Notification from " + location.host,
          icon: (values.icon) ? values.icon : 'http://' + location.host + "/favicon.ico",
          priority: (values.priority) ? values.priority : 0,
          sticky: (values.sticky) ? values.sticky : false,
          identifier: (values.identifier) ? values.identifier : null
        };

        if(this.prism){
          window.platform.showNotification(args.title, args.description, args.icon);
        } else if(this.fluid){
          fluid.showGrowlNotification(args);
        }
      }
    }

    window.notifications = notifications;
  }

  if (!window.dockBadge){
    var prism = false;
    try {
      window.platform.icon().badgeText;
      prism = true;
    } catch(e) {}

    if (prism){
      window.dockBadge = function(text) {
        window.platform.icon().badgeText = text;
      }
    } else if (window.fluid){
      window.dockBadge = function(text) {
        window.fluid.dockBadge = text + '';
      }
    } else {
      window.dockBadge = function(text){
      }
    }
  }
}());
Talker.Paste = {};

Talker.Paste.rewriteAttributions = function(cs, attrib, userId) {
  var re = new RegExp("\\*" + attrib, "g");
  return cs.replace(re, "*" + userId);
}
Talker.Paste.createAttributions = function(cs) {
  var pool = [];
  var authors = {};
  var parts = cs.split("*");
  for (var i=0; i < parts.length; i++) {
    var id = parts[i].match(/^\d+/);
    if (id) { // this part is an attribution
      var num = authors[id];
      if (num == null) { // add the author to the pool
        authors[id] = num = pool.length;
        pool.push(["author", id]);
      }
      parts[i] = parts[i].replace(/^\d+/, num);
    }
  };
  return { changeset: parts.join("*"), pool: pool };
}

Talker.userColors = {};
Talker.Paste.Updater = function(editor) {
  var self = this;

  self.addColor = function(userId, color) {
    Talker.userColors[userId] = color;
    editor.setAuthorInfo(userId.toString(), {bgcolor: color});
  };

  self.onInitialContent = function(event) {
    if (event.attributions) {
      var attribs = Talker.Paste.createAttributions(event.attributions);
      editor.setBaseAttributedText({text: event.content + "\n", attribs: attribs.changeset },
                                   { numToAttrib: attribs.pool });
    } else {
      editor.setBaseText(event.content + "\n");
    }
    return false;
  };

  self.onDiffReceived = function(event) {
    var attribs = Talker.Paste.createAttributions(event.content);
    try {
      editor.applyChangesToBase(attribs.changeset, event.user.id.toString(),
                                { numToAttrib: attribs.pool });
    } catch (e) {
      editor.setEditable(false);
      Talker.client.close();
      alert("Looks like your paste is out of sync with the server. Please refresh to edit this paste again.");
    }
  };

  self.onMessageReceived = function(event) {
    if (event.initial) {
      return self.onInitialContent(event);
    }

    if (event.user.id == Talker.currentUser.id) return false;

    self.addColor(event.user.id.toString(), event.color);
    self.onDiffReceived(event);
  };

  self.onToken = function(event) {
    var cs = editor.prepareUserChangeset();
    if (cs && cs.changeset) {
      var diff = Talker.Paste.rewriteAttributions(cs.changeset, 0, Talker.currentUser.id);
      Talker.client.send({type: 'message', content: diff, color: Talker.currentUser.color});
      editor.applyPreparedChangesetToBase();
    }
  };
};
$(function() {
  if (!$.browser.safari) {
    $("input[type=text], input[type=search]").
      focus(function() {
        if ($(this).attr('placeholder') && $(this).val() == $(this).attr('placeholder')) {
          $(this).val('').removeClass("placeholder");
        }
      }).
      blur(function() {
        if ($(this).attr('placeholder') && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
          $(this).addClass("placeholder").val($(this).attr('placeholder'));
        }
      }).
      trigger("blur");
  }
});
$(function() {
  $('#sidebar .toggle_sidebar').click(function(e) {
    $('#sidebar #room, #sidebar #utilities, #sidebar .logo').toggle();
    $('#main, #message_form, #sidebar .toggle_sidebar').toggleClass('expanded');
    Talker.trigger("Resize");
  });
  $('#message_form .form_help').click(function(e) {
    var help_div = $('<div/>').addClass('small');
    $(help_div).append($('<h3/>').html("Help"));
    $(help_div).append($('<p/>').html('If you need a hand with anything send us an <a href="mailto:help@talkerapp.com">email</a>.'));
    $(help_div).append($('<br/>'))
    $(help_div).append($('<h4/>').html("Available commands:"));
    _.each(Talker.getCommandsAndUsage(), function(cmd_usage) {
      $(help_div).append($('<blockquote/>').css({'padding': '3px', 'font-size': 'small', 'font-family': 'monospace'}).html(cmd_usage[1]));
    });
    jQuery.facebox(help_div);
  });

  $('#rooms_controller.show #room_name').click(function(e) {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
    e.stopPropagation();
  });

  $(document).click(function(e){
    $('#rooms_controller.show #rooms').hide();
    $('#rooms_controller.show #room span.switch_rooms').removeClass('show_rooms').addClass('hide_rooms');
  });

  if ($('#upload')[0]){
    new AjaxUpload('#upload', {
      action: $('a#upload').attr('href'),
      name: 'upload',
      responseType: 'json',
      onComplete: function(file, response) {
        $("#upload").show();
        $("#upload_loader").hide();
        if (response.error) {
          alert("Error uploading file: " + response.error);
        } else {
          Talker.sendMessage(response.url);
        }
      },
      onSubmit: function() {
        if ($.browser.safari){
          $.get("/close_connection", {async: false});
        }
        $("#upload").hide();
        $("#upload_loader").show();
      }
    });
  }

  $("div#guest_access a").
    live("click", function() {
      var link = $(this);
      link.hide();
      $("#guest_access_loader").show();
      $.post(this.href, function() {
        if (link.hasClass("enable"))
          var action = "enabled";
        else
          var action = "disabled";
        Talker.sendAction(action + " guest access", {update:true});
      });
      return false;
    });

  $("input#guest_url").live("click", function() {
    this.select();
  });
});
function ParseError(message){
  this.message = message || "";
  this.name = "ParseError";
};
ParseError.prototype = new Error;

function shellwords(line){
  var words = _.map(line.split(/(\"[^\"]+\")/), function(block){
    var matches = block.match(/^\"(.*)\"$/);
    if (matches){
      return matches[1];
    } else {
      return block.split(/ +/);
    }
  });
  words = _.flatten(words);
  words = _.compact(words);
  if (_.detect(words, function(word){ return word.match(/\"/)})){
    throw new ParseError("Unmatched quote");
  }
  return words;
}
(function($){
  $.fn.autocompleter = function(trigger, finder, options) {
    var element = $(this);
    var currentCycle = null;
    var tab = false;
    options = options || {};

    element.
      keydown(function(e) {
        if (e.which == 9) { // tab
          tab = true;
          e.preventDefault();
        } else {
          tab = false;
          currentCycle = null;
        }
      }).
      keyup(function(e){
        if (!tab && controlChar(e.keyCode)) return;

        var position = element.getCaretPosition();
        var value = element.val();
        var nameStart = value.lastIndexOf(trigger, position);
        if (options.startOnly && nameStart > 0) return;

        if (nameStart != -1 && value.lastIndexOf(" ", position) < nameStart) {
          nameStart = nameStart + 1
          var nameEnd = value.indexOf(" ", position);
          if (nameEnd == -1) nameEnd = position;

          var pattern = value.substring(nameStart, nameEnd);
          var results = _.select((typeof finder == 'function' ? finder() : finder), function(name) {
            var regexp = new RegExp("^" + pattern, "i");
            return name.match(regexp);
          });
          var name = cycle(results, e.shiftKey);
          if (name) {
            var completion = name.substring(pattern.length);
            if (tab && results.length == 1) {
              element.insertAtCaret(completion + " ").
                      setCaretPosition(position + completion.length + 1);
            } else {
              element.insertAtCaret(completion).
                      setCaretPosition(position, position + completion.length);
            }
          }
        }
      });

    function controlChar(keyCode) {
      return String.fromCharCode(keyCode).match(/[^\w]/);
    };

    function cycle(values, reverse) {
      values = (reverse ? values.reverse() : values);

      if (currentCycle == null || _.indexOf(values, currentCycle) == values.length - 1) {
        return currentCycle = values[0];
      } else {
        return currentCycle = values[_.indexOf(values, currentCycle) + 1];
      }
    };
  }
})(jQuery);
Talker.Broadcaster = {
  callbacks: ["Load", "MessageReceived",
              "Join", "Leave", "Back", "Idle",
              "Users", "Open", "Connected", "Token",
              "Close", "Error"],
  plugins: [],

  broadcast: function(eventName, eventData) {
    try{
      var eventHandlerString = "on" + eventName;
      for (var i = 0, len = this.plugins.length; i < len; i++){
        var fn = this.plugins[i][eventHandlerString];
        if (fn && fn(eventData) === false){
          return false;
        }
      };
      return true;
    }catch(e){
      var error = '<b>Plugin Error (on' + eventName + '):</b><br/><br/>'
        + e
        + '<br/><br/>Try disabling your plugins.  One of them is playing tricks on you!'
        + "<br/><br/>Contact help@talkerapp.com if you need a hand with anything.";

      window.setTimeout(function(){
        $.facebox(error);
      }, 1000);
      window.console && window.console.error && window.console.error(error.replace('<br/>', '\n'))
    }
  },

  broadcastEvent: function(event) {
    var eventName = (event.type == 'message'
                  ? 'MessageReceived'
                  :  event.type.charAt(0).toUpperCase() + event.type.substr(1, event.type.length));
    Talker.Broadcaster.broadcast(eventName, event);
  }
};

_.each(Talker.Broadcaster.callbacks, function(callback){
  Talker.Broadcaster["on" + callback] = function(data) {
    Talker.Broadcaster.broadcast(callback, data);
  };
});

Talker.plugins = Talker.Broadcaster.plugins;
Talker.trigger = Talker.Broadcaster.broadcast;
function focusMsgBox() {
  var msgbox = $('#msgbox')[0];
  if (msgbox){
    $('#msgbox').setCaretPosition(-1);
    msgbox.focus();
    return true;
  }
  return false;
};

$(function() {
  $('#send').click(function(e) {
    if ($('#msgbox').val().length){
      Talker.trigger("MessageSend", {type:"message", content: $("#msgbox").val()});
    }
    e.preventDefault();
  });
  $('#msgbox')
    .keydown(function(e){
      switch (e.which){
        case 33:
        case 34:
          break;
        case 13: // enter
          if (e.shiftKey) return; // line break
          if (this.value == '') return false; // ignore empty messages

          Talker.trigger("MessageSend", {type:"message", content: $("#msgbox").val()});
          return false;
          break;

        case 27: // esc
          $('#msgbox').focus().val('');
          $(document).trigger('close.facebox');
          break;
      }
    });

  $(window).keydown(function(e){
    switch (e.which){
      case 224: // Cmd in FF
      case 91:  // Cmd in Safari
      case 67:  // Cmd+c Ctrl+c
      case 17:  // Ctrl
      case 33:  // PageUp
      case 34:  // PageDown
        break;
      case 13:  // enter
        if (focusMsgBox()){
          e.preventDefault();
        }
        break;
      default:
        focusMsgBox();
        break;
    }
  });

  $('#msgbox, input.search, #edit_room form input, #edit_room form textarea').keydown(function(e){
    if (e.which == 33 || e.which == 34){
      return;
    } else {
      e.stopPropagation();
    }
  });

  $(window).resize(function(){ Talker.trigger('Resize') });

  Talker.trigger('Resize');
});
var FormatHelper = {
  timestamp2date: function(timestamp){
    if (timestamp) return new Date(timestamp * 1000);
    return null;
  },

  getUrlDate: function(timestamp){
    var d = FormatHelper.timestamp2date(timestamp);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/')
  },

  getMonth: function(timestamp){
    var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    return months[FormatHelper.timestamp2date(timestamp).getMonth()];
  },

  getDate: function(timestamp){
    return FormatHelper.timestamp2date(timestamp).getDate();
  },

  toHumanTime: function(timestamp) {
    var date = FormatHelper.timestamp2date(timestamp);
    var minutes = date.getMinutes() - date.getMinutes() % 5;

    return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      + (minutes < 10 ? '0' + minutes : minutes)
  },

  formatDate: function(timestamp) {
    var d = new Date(timestamp * 1000);
    d = new Date();
    return dateFormat(d, "mediumDate") + " " + dateFormat(d, "shortTime");
  }
}

function truncate(str, size) {
  size = size || 50;
  return str.substring(0, size) + (str.length > size ? "..." : "");
}
/* JavaScript implementation of the Talker protocol
 * for use with TCPSocket from Orbited or a facsimile.
 */

TALKER_DEBUG = false;

if (TALKER_DEBUG) {
    function getTalkerLogger(name) {
        return {
            debug: function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(name, ": ");
                console.debug.apply(console, args);
            },
            dir: function() {
                console.debug(name, ":");
                console.dir.apply(console, arguments);
            }
        };
    }
} else {
    function getTalkerLogger(name) {
        return {
            debug: function() {},
            dir: function() {}
        };
    }
}


LineProtocol = function(transport) {
    var log = getTalkerLogger("LineProtocol");
    var self = this;
    var buffer = null;
    var isLineMode = true;


    transport.onopen = function() {
        buffer = "";
        isLineMode = true;
        self.onopen();
    };

    transport.onclose = function(code) {
        buffer = null;
        self.onclose(code);
    };

    transport.onerror = function(error) {
        self.onerror(error);
    };

    transport.onread = function(data) {
        log.debug("transport.onread: enter isLineMode=", isLineMode, " buffer[", buffer.length, "]=", buffer, " data[", data.length, "]=", data);

        if (isLineMode) {
            buffer += data;
            data = "";

            var start = 0;
            var end;
            while ((end = buffer.indexOf("\n", start)) >= 0 && isLineMode) {
                var line = buffer.slice(start, end);
                log.debug("fire onlinereceived line[", line.length, "]=", line);
                self.onlinereceived(line);
                start = end + 1;
            }
            buffer = buffer.slice(start);

            if (isLineMode) {
            } else {
                data = buffer;
                buffer = "";
            }
        }

        if (data.length > 0) {
            log.debug("fire onrawdatareceived data[", data.length, "]=", data);
            self.onrawdatareceived(data);
        }

        log.debug("transport.onread: leave");
    };


    self.setRawMode = function() {
        log.debug("setRawMode");
        isLineMode = false;
    };

    self.setLineMode = function(extra) {
        log.debug("setLineMode: extra=", extra);
        isLineMode = true;
        if (extra && extra.length > 0)
            transport.onread(extra);
    };

    self.send = function(data) {
        log.debug("send: data=", data);
        return transport.send(data);
    };

    self.open = function(host, port, isBinary) {
        log.debug("open: host=", host, ':', port, ' isBinary=', isBinary);
        transport.open(host, port, isBinary);
    };

    self.close = function() {
        log.debug("transport.close");
        transport.close();
    };
    self.reset = function() {
        transport.reset();
    }

    self.onopen = function() {};
    self.onclose = function() {};
    self.onerror = function(error) {};
    self.onlinereceived = function(line) {};
    self.onrawdatareceived = function(data) {};
};
Talker.ClearCommand = function() {
  var self = this;

  self.command = 'clear';
  self.usage = '/clear';

  self.onCommand = function(event){
    if (event.command == 'clear') {
      Talker.insertNotice({user: {name: ''}, content: 'Last clear occured at this point.'});
      while($('#log tr').length > 1) {
        $('#log tr:first').remove();
      }
      Talker.getMessageBox().val('');
      return false;
    }
  }
}
Talker.CommandAutocompleter = function(){
  var self = this;

  Talker.getMessageBox().autocompleter("/", Talker.getCommands, {startOnly:true});
}
function CommandError(message){
  this.message = message || "";
  this.name = "CommandError";
};
CommandError.prototype = new Error;
Talker.DefaultCommand = function() {
  var self = this;

  self.onCommand = function(event) {
    alert('unrecognizable command');
  }
}
Talker.DefaultFormatter = function() {
  var self = this;

  self.onMessageReceived = function(event) {
    var url_expression = /(https?:\/\/|www\.)[^\s<]*/gi;
    var protocol_expression  = /^(http|https|ftp|ftps|ssh|irc|mms|file|about|mailto|xmpp):\/\//;

    var content = event.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (content.match(url_expression)){
      Talker.insertMessage(event, content.replace(url_expression, function(locator){
        return '<a href="'
          +  (!locator.match(protocol_expression) ? 'http://' : '') + locator
          + '" target="_blank">'
          +   locator
          + "</a>";
      }));
    } else if (Talker.isPaste(event)) {
      Talker.insertMessage(event, '<div><pre>' + content + '</pre></div>');
    } else {
      Talker.insertMessage(event, content);
    }
  }

  self.onMessageInsertion =
  self.onResize = function() {
    window.setTimeout(function(){
      var maxWidth = Talker.getMaxContentWidth();

      $('#log pre').css('width', maxWidth - 22 + 'px');   // pastes and messages sent with multilines
      $('#log blockquote').css('width', maxWidth + 'px'); // long sentences with no line breaks
    },0);
  }
};
Talker.ErrorHandler = function(element) {
  var self = this;

  self.onOpen =
  self.onConnected = function() {
    element.hide().html("");
  }

  self.onClose = function() {
    element.show().html(
      $("<p/>").html("Connection lost with the chat server, trying to reconnect ...")
    );
  }

  self.onError = function(event) {
    alert(event.message);
    location.pathname = "/rooms";
  }
}
Talker.FeedFormatter = function() {
  var self = this;

  var template = '\
    <small class="timestamp"><%= FormatHelper.formatDate(published) %></small> \
    <a href="http://<%= h(source) %>/" class="favicon"> \
      <img src="//<%= h(source) %>/favicon.ico" /> \
    </a> \
    <a href="<%= h(url) %>" class="title"> \
      <%= h(author) %>: <%= h(title) %> \
      <b class="fade"><!----></b> \
    </a> \
    <b class="content_tail"><!----></b> \
    <pre class="content"><%= h(content) %></pre>';

  self.onMessageReceived = function(event) {
    if (event.feed) {
      Talker.insertMessage(event, _.template(template, event.feed));
      Talker.getLastRow().addClass("feed");
      return false;
    }
  }
};
Talker.HelpCommand = function() {
  var self = this;

  self.command = 'help';
  self.usage = '/help';

  self.onCommand = function(event) {
    if (event.command == "help") {
      var help_div = $('<div/>').addClass('small');

      $(help_div).append($('<h3/>').html("Help"));
      $(help_div).append($('<p/>').html('If you need a hand with anything send us an <a href="mailto:help@talkerapp.com">email</a>.'));
      $(help_div).append($('<br/>'))
      $(help_div).append($('<h4/>').html("Available commands:"));
      _.each(Talker.getCommandsAndUsage(), function(cmd_usage) {
        $(help_div).append($('<blockquote/>').css({'padding': '3px', 'font-size': 'small', 'font-family': 'monospace'}).html(cmd_usage[1]));
      });
      jQuery.facebox(help_div);

      Talker.getMessageBox().val('');
      return false;
    }
  }
}
Talker.HighlightMe = function(){
  var plugin = this;

  plugin.onMessageInsertion = function(event) {
    var me = new RegExp("\\b" + Talker.currentUser.name + "\\b", 'gi');

    var blocks = $("blockquote").each(function(){
      if ($(this).html().replace(/<\/?[^>]+>/gi, ' ').match(me)) {
        $(this).css({
          '-moz-box-shadow': '0 0 10px yellow',
          '-webkit-box-shadow': '0 0 10px yellow',
          'box-shadow': '0 0 10px yellow'
        });
      }
    });
  }
}
Talker.ImageFormatter = function() {
  var self = this;

  self.onMessageReceived = function(event){
    var image_expression = /(^https?:\/\/[^\s]+\.(?:gif|png|jpeg|jpg)(\?)*(\d+)*$)/gi;
    var image_match = event.content.match(image_expression);

    if ($('#talker_image_preloading_div').length == 0){
      $("<div/>").attr('id', 'talker_image_preloading_div')
        .css({position:'absolute', top: '-100px', left: '-100px', height: '100px', width: '100px', overflow: 'hidden'})
        .appendTo(document.body);
    }

    if (image_match){
      var fallbackId = 'img_url_' + event.id;
      var imageUrl = image_match[0];
      var fallback = '<a href="' + imageUrl + '" target="_blank" id="' + fallbackId + '">' + imageUrl + '</a>';
      Talker.insertMessage(event, fallback);

      var img = $('<img/>').load(function(){
        $(this).remove();

        var imageForHeight = new Image();
        imageForHeight.src = image_match[0];

        window.setTimeout(function() { // give it time to figure out the height of the image.
          $('#' + fallbackId).replaceWith(
                '<a href="'
              + image_match[0]
              + '" target="_blank"><img src="'
              + image_match[0]
              + '" style="max-height: 300px; max-width: ' + Talker.getMaxContentWidth() + ';" class="from_url" />'
              + '</a>'
          );

          Talker.trigger('MessageInsertion', event);

          Talker.trigger('Nudge', imageForHeight.height + 50); // + 50 for borders and container margins.
        }, 10);
      });

      $('#talker_image_preloading_div').append(
        img.attr('src', image_match[0])
      );

      return false;
    }
  }

  self.onMessageInsertion = function() {
    var maxWidth = Talker.getMaxContentWidth();

    Talker.getLastRow().find("img[class='from_url']").each(function(){
      if (!$.browser.msie) $(this).css({maxWidth: 'auto'});
      $(this).css({maxWidth: maxWidth + 'px'});
    });
  }

  self.onResize = function() {
    var maxWidth = Talker.getMaxContentWidth();

    $("#log img[class='from_url']").each(function(){
      if (!$.browser.msie) $(this).css({'max-width': 'auto'});
      $(this).css({'max-width': maxWidth + 'px'});
    });
  }
};
Talker.InviteCommand = function(options) {
  var self = this;

  self.command = 'invite';
  self.usage = '/invite john.doe@email.com';

  self.onCommand = function(event) {
    if (event.command == "invite") {
      var userEmails = event.args.join(",");

      $.post(options.invites_url, {invitees: userEmails, room_id: Talker.getRoom().id}, null, 'script');

      Talker.getMessageBox().val('');
      return false;
    }
  }
}
Talker.Loading = function() {
  var plugin = this;

  plugin.onConnected = function(event) {
    $("#curtain, #loading").fadeOut("normal", function() { $(this).remove() });
  };
};
Talker.LogSweeper = function(logElement) {
  var self = this;
  var maxLogSize = 50;

  self.onJoin =
  self.onLeave =
  self.onMessageReceived = function() {
    if (logElement.find("tr").size() <= maxLogSize) return;

    var element = logElement.find("tr:first");
    if (element.hasClass("timestamp")) {
      element.next("tr").remove();
    }
    element.remove();
  };
};
Talker.LogsJoinLeave = function(){
  var plugin = this;

  plugin.onLeave = function(event) {
    Talker.insertNotice(event, h(event.user.name) + ' has left the room');
  }
  plugin.onJoin = function(event) {
    Talker.insertNotice(event, h(event.user.name) + ' has entered the room');
  }
}
Talker.LogsUserList = function(element) {
  var self = this;

  self.onJoin =
  self.onMessageReceived = function(event) {
    add(event.user);
  };

  function add(user) {
    if ($("#user_" + user.id).length < 1) {
     $('<li/>')
        .attr("id", "user_" + user.id)
        .attr('user_id', user.id)
        .attr('user_name', user.name)
        .html('<img alt="' + user.name + '" src="' + avatarUrl(user) + '" /> ' + user.name)
        .appendTo(element);
    }
  };
}

Talker.LogsViewInContext = function(){
  var self = this;

  self.onMessageInsertion = function(event){
    var room = event.room.id;
    var id = event.id;

    Talker.getLastInsertion().prepend(
      $("<a/>").addClass('log')
        .attr("href", "/rooms/" + room + "/logs/" + FormatHelper.getUrlDate(event.time) + "#event_" + id)
        .text("View in context")
    );
  }
}
Talker.MeCommand = function() {
  var self = this;

  self.command = 'me';
  self.usage = '/me loves pizza';

  self.onCommand = function(event) {
    if (event.command == "me") {
      Talker.sendAction(event.args.join(" "));
      Talker.getMessageBox().val('');
      Talker.trigger("MessageSent", event);
      return false;
    }
  }

  self.onMessageReceived = function(event) {
    if (event.action) {
      Talker.insertNotice(event, event.user.name + ' ' + event.content);
      return false;
    }
  }
}
Talker.MsgCommand = function() {
  var self = this;

  self.command = 'msg';
  self.usage = '/msg @username This is your message';

  self.onCommand = function(event) {
    if (event.command == "msg") {
      var userName = event.args[0].replace('@', '').toLowerCase();
      var user = _.detect(Talker.users, function(user) { return user.name.toLowerCase() == userName });

      if (user == null) throw new CommandError("Unknown user: " + userName);

      var content = event.args.slice(1).join(" ");

      Talker.client.send({content: content, to: user.id});
      Talker.getMessageBox().val('');
      Talker.trigger("MessageSent", event);

      Talker.insertMessage({
        content: 'to ' + user.name  + '&nbsp;&nbsp;<img src="' + avatarUrl(user) + '" height="16" width="16" alt="' + user.name + '" class="avatar private" />&nbsp;' + content,
        private: true,
        time: parseInt(new Date().getTime() / 1000),
        type: "message",
        user: Talker.currentUser
      });

      return false;
    }
  }
}
Talker.Notifier = function(){
  var self = this;

  var dom_element, on_focus, on_blur;

  if ($.browser.mozilla) {
    dom_element = document, on_focus = "focus", on_blur = "blur";
  } else if ($.browser.msie) {
    dom_element = document, on_focus = "focusin", on_blur = "focusout";
  } else { // safari and others
    dom_element = window, on_focus = "focus", on_blur = "blur";
  }


  $(dom_element)
    .bind(on_focus, function(e){
      Talker.trigger("Focus");
    })
    .bind(on_blur, function(){
      Talker.trigger("Blur");
    });
}
Talker.PasteFormatter = function() {
  var self = this;

  self.onMessageReceived = function(event) {
    if (event.paste){
      var wrapLines     = (!(/^[\t| ]+/mg).test(event.content));
      var whiteSpace    = 'white-space:' + (wrapLines ? 'pre-wrap' : 'pre') + ';';
      var shownContent  = event.content;
      var moreLines     = false;
      var moreChars     = false;

      if (wrapLines) {
        if (event.content.length > 730){
          moreChars =  "<span class='more_lines'>(" + (event.content.length - 730) + " more characters)</span>";
          shownContent = event.content.substr(0, 730) + '...';
        }
      } else {
        if (event.paste.lines > event.paste.preview_lines) {
          moreLines = " <span class='more_lines'>(" + (event.paste.lines - event.paste.preview_lines) + " more lines)</span>";
        }
        shownContent = event.content;
      }

      var newContent = ''
        + "<a target='_blank' title='Paste #" + event.paste.id + "' href='"
        + window.location.protocol + "//" + window.location.host + "/pastes/" + event.paste.id
        + "' class='view_paste'>View / Edit paste</a> "
        + (moreLines || moreChars || '')
        + '<div><pre style="width: ' + Talker.getMaxContentWidth() + 'px; ' + whiteSpace + '" id="past_pre_' + event.paste.id + '">'
        + shownContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        + '</pre></div>'

      Talker.insertMessage(event, newContent);
      return false;
    }
  }

};
Talker.Pending = function() {
  var self = this;

  self.onMessageReceived = function(talkerEvent) {
    if (talkerEvent.id == "pending") return;

    var pending = Talker.getLastPending();

    if (pending[0] && talkerEvent.user.id == Talker.currentUser.id) {
      if (Talker.isPaste(talkerEvent)) {
        pending.remove(); // Pending pastes are shown as a loading gif.
      } else {
        pending.attr("id", "event_" + talkerEvent.id).removeAttr("pending");
        return false;
      }
    }
  }
}
Talker.ReceivedSound = function() {
  var self = this;

  self.command = 'togglesound';
  self.usage = '/togglesound';

  self.onCommand = function(talkerEvent) {
    if (talkerEvent.command == self.command) {
      $.cookie('ReceivedSound', ($.cookie('ReceivedSound') == 'false' ? 'true' : 'false'), {
        expires: (function(){ var d = new Date(); d.setTime(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); return d })() // 10 years from now
      });
      Talker.getMessageBox().val('');

      $('#toggle_sound').attr('class', $.cookie('ReceivedSound') == 'true' ? 'active' : 'inactive');

      return false;
    }
  }

  self.onLoaded = function() {
    if ($.cookie('ReceivedSound') != 'false') {
      $.cookie('ReceivedSound', 'true', {
        expires: (function(){ var d = new Date(); d.setTime(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); return d })() // 10 years from now
      });
    }

    self.loaded = true;

    $(document.body).append($('<audio/>').attr('src', '/sounds/borealis/message_received.wav')); // preloads for faster play on first message.
    var toggleButton = $("<span id='toggle_sound'><span class='sound_img'/></span>");
    $('#message_form').prepend(toggleButton);
    toggleButton.attr('class', $.cookie('ReceivedSound') == 'true' ? 'active' : 'inactive');
    toggleButton.click(function(){
      Talker.trigger("Command", {type: "command", command: 'togglesound'});
    });
  }

  self.onBlur = function() {
    self.onMessageReceived = function(talkerEvent) {
      if (self.loaded && talkerEvent.user.id != Talker.currentUser.id && $.cookie('ReceivedSound') == 'true') {
        $(document.body).append(
          $('<audio/>').attr('src', '/sounds/borealis/message_received.wav').attr('autoplay', 'true').bind('ended', function(){ $(this).remove() })
        );
      }
    }
  }

  self.onFocus = function() {
    self.onMessageReceived = function(){};
  }
}
Talker.RoomUpdater = function(url) {
  var self = this;

  self.onLoaded = function() {
    self.onMessageReceived = function(event) {
      if (event.update) {
        $.getScript(url);
      }
    };
  };
};

Talker.MainScroller = Class.extend({
  init: function(){
    var self = this;

    self.defaultScrollAmount = 50000;

    self.scrollBy = function(height) {
      window.scrollBy(0, height);
    }

    self.scrollToBottom = function() {
      if (self.defaultScrollAmount !== 0){
        self.scrollBy(self.defaultScrollAmount);
      }
    }

    self.atBottom = function() {
      return !($(window).height() - $(document).height() + $(window).scrollTop());
    }

    $(document.body).mousewheel(function(event, delta) {
      if (delta > 0){
        self.defaultScrollAmount = 0;
      } else if (self.atBottom()) {
        self.defaultScrollAmount = 50000;
      }
    });

    $(document).everyTime(50, 'scroll down continuously', function(i) {
      self.scrollToBottom();
    });

    self.onJoin =
    self.onLeave =
    self.onNoticeInsertion =
    self.onMessageInsertion =
    self.onLoaded =
    self.onResize =
    self.onMessageSent = function(event) {
      self.scrollToBottom();
    }
  }
});

if ($.browser.safari) { // webkit akshully only browser to handle order of onscroll events properly.
  Talker.Scroller = Talker.MainScroller.extend({
    init: function() {
      var self = this;

      self._super(false);

      $(window).scroll(function(e){
        if (!self.scrollingWithJS){
          self.defaultScrollAmount = self.atBottom() ? 50000 : 0 ;
        }
      });
    },
    scrollBy: function(height) {
      var self = this;

      self.scrollingWithJS = true;
      window.scrollBy(0, height);
      self.scrollingWithJS = false;
    }
  });
} else { // gecko based browsers and others
  Talker.Scroller = Talker.MainScroller.extend({
    init: function() {
      var self = this;
      self._super(false);

      $(document).mousedown(function(e) {
        self.defaultScrollAmount = 0;
      }).mouseup(function(e) {
        if (self.atBottom()){
          self.defaultScrollAmount = 50000;
        }
      });
    }
  });
}
Talker.Sender = function(msgbox) {
  var self = this;

  self.onMessageSend = function(event) {
    if (!event.content) return;

    if (!Talker.isPaste(event) && event.content.indexOf("/") == 0) {
      try {
        var args = shellwords(event.content.substr(1));
        Talker.trigger("Command", {type: "command", command: args[0], args: args.slice(1)});
      } catch (e) {
        if (e.name == "ParseError" || e.name == "CommandError") {
          alert(e.message);
        } else {
          throw e;
        }
      }
      return;
    }

    Talker.sendMessage(event.content);

    if (msgbox.val() === event.content)
      msgbox.val('');

    Talker.trigger("MessageSent", event);
  }
}
Talker.Timestamp = function(reverse) {
  var self = this;
  var interval = 5 * 60;
  var lastTime = null;

  reverse = (reverse === true ? -1 : 1);

  self.onJoin =
  self.onLeave =
  self.onMessageReceived = function(event) {
    if (lastTime == null || (lastTime - event.time) * reverse < -interval) {
      addToLog(event.time, lastTime);
    }
    lastTime = event.time;
  }

  function addToLog(time, lastTime) {
    var last_row = Talker.getLastRow();
    if (last_row.hasClass('timestamp')) {
      last_row.remove();
    }
    var element = $('<tr/>').addClass('timestamp');

    var date = FormatHelper.timestamp2date(time);
    var lastDate = FormatHelper.timestamp2date(lastTime);

    if (lastDate == null || (date.getFullYear() != lastDate.getFullYear() ||
                             date.getMonth() != lastDate.getMonth() ||
                             date.getDate() != lastDate.getDate())
        ) {
      element
        .append($('<td/>').addClass('date')
          .append($('<div/>')
            .append($('<span/>').addClass('marker').html(
              '<b><!----></b><i><span class="date">'
                + FormatHelper.getDate(time)
              + '</span><span class="month">'
                + FormatHelper.getMonth(time)
              + '</span></i>')
            )
          )
        );
    } else {
      element.append($('<td/>'));
    }

    element
      .append($('<td/>').addClass('time')
        .append($('<div/>')
          .append($('<span/>').addClass('marker').attr('time', time)
            .html('<b><!----></b><i>' + FormatHelper.toHumanTime(time) + '</i>')
          )
        )
      );

    element.appendTo('#log');
    Talker.lastInsertionEvent = Talker.dummyInsertion;
  }
}
Talker.UserColors = function(element) {
  var self = this;

  self.onLoaded = function(){
    self.onMessageReceived = function(event) {
      updateUserColor(event.user, event.color);
    };

    self.onJoin = function(event) {
      updateUserColor(event.user, Talker.userColors[event.user.id]);
    }

    self.onUsers = function(event) {
      $(event.users).each(function(){
        updateUserColor(this, Talker.userColors[this.id]);
      });
    }
  }

  function updateUserColor(user, color) {
    var userElement = $("#user_" + user.id);
    userElement.css('backgroundColor', color);
    return userElement;
  };
}
Talker.UserList = function(element) {
  var self = this;

  self.onLoaded = function(){
    self.onJoin = function(event) {
      add(event.user);
    };

    self.onMessageReceived = function(event) {
      update(event.user);
    };

    self.onLeave = function(event) {
      remove(event.user);
    }

    self.onIdle = function(event) {
      update(event.user);
      userElement(event.user).css('opacity', 0.5).addClass('idle');
    };

    self.onBack = function(event) {
      update(event.user);
      userElement(event.user).css('opacity', 1.0).removeClass('idle');
    };

    self.onUsers = function(event) { // this only ever occurs from talker directly so no worries about logs impeding.
      $("#people").html("");
      $(event.users).each(function(){
        add(this);
      });
    }
  }

  function userElement(user) {
    return $("#user_" + user.id)
  }

  function remove(user) {
    userElement(user).animate({opacity: 0.0}, 400, function(){ $(this).remove() });
  }

  function add(user) {
    if (userElement(user).length < 1) {
      updateUserElement($('<li/>'), user).attr("id", "user_" + user.id). // ID never changes
                                          attr('user_id', user.id).
                                          appendTo(element);
    }
  };

  function update(user) {
    var e = userElement(user);
    if (e.length > 0) {
      updateUserElement(e, user);
    }
  }

  function updateUserElement(userElement, user) {
    var oldName = userElement.attr('user_name');
    if (user.name != oldName) {
      userElement.attr('user_name', user.name).
                  attr('title', user.name).
                  html(
                    $("<img/>").attr("alt", h(user.name)).
                                attr("src", avatarUrl(user))
                  ).
                  append("\n" + truncate(h(user.name), 8));
    }
    return userElement;
  };
}

Talker.UsernameAutocompleter = function(){
  var self = this;

  Talker.getMessageBox().autocompleter("@", function() {
    return _.reject(Talker.getRoomUsernames(), function(name){
      return name === Talker.currentUser.name
    });
  });
}
Talker.users = [];

Talker.Users = function(element) {
  var self = this;

  self.onLoaded = function() {
    self.onMessageReceived =
    self.onJoin = function(event) {
      self.add(event.user);
    }

    self.onLeave = function(event) {
      self.remove(event.user);
    }

    self.onUsers = function(event) {
      Talker.users = event.users;
    }
    self.add = function(user) {
      self.remove(user);
      Talker.users.push(user);
    };

    self.remove = function(user) {
      Talker.users = _.reject(Talker.users, function(u) { return u.id == user.id });
    };
  };
}

Talker.YoutubeFormatter = function() {
  var self = this;

  self.onMessageReceived = function(event){
    var youtube_expression = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var youtube_match  = event.content.match(youtube_expression);

    if (youtube_match){
      var color = (event.user.id == Talker.currentUser.id ? '&color1=0xD8CCBC&color2=0xFAEEDE' : '&color1=0xBBCCC6&color2=0xDDEFF8');
      Talker.insertMessage(event,
        '<object width="425" height="355" style="z-index: 1;">'
        + '<param name="movie" value="http://www.youtube.com/v/' + youtube_match[1] + '&egm=1&rel=0&fs=1' + color + '"></param>'
        + '<param name="allowFullScreen" value="true"></param>'
        + '<param name="wmode" value="transparent">'
        + '<embed src="http://www.youtube.com/v/' + youtube_match[1] + '&egm=1&rel=0&fs=1' + color + '"'
        + ' type="application/x-shockwave-flash"'
        + '  width="425" height="355" '
        + '  allowfullscreen="true" wmode="transparent"></embed>'
        + '</object>'
      );
      return false;
    }
  }
};
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

String.prototype.assetHash = function() {
  var start = 0;
  for (var i = 0; i < this.length; i++){
    start += this.charCodeAt(i);
  }
  return parseInt(start);
}

function assetHost(path) {
  var domain = "talkerapp.com";
  var id = path.assetHash() % 4;
  return "//assets" + id + "." + domain + path;
}

function avatarUrl(user, size) {
  size = size || 18;
  return assetHost("/avatar/" + MD5(user.email || "") + ".jpg?s=" + size);
}

$(function() {
  $("#room_access_private, #room_access_public").change(function() {
    var privateAccess = $("#room_access_private")[0].checked;
    if (privateAccess) {
      $("#invitees").show();
    } else {
      $("#invitees").hide();
    }
  }).trigger("change");
});
