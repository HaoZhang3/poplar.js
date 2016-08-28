/**
 * Created by Poplar on 2016/8/18.
 */
(function( window,undefined ){

    //����poplar���캯��(���Ⱪ¶��ֻ��һ��poplar)
    function poplar(selector){
        //�Ѵ���ʵ��������װ��������
        return new poplar.fn.init( selector );
    }

    //���캯����ԭ��
    poplar.fn=poplar.prototype = {
        constructor:poplar,
        type:'poplar',
        //ʵ���ϵĹ��캯��(��������)
        init: function ( selector ) {
            if( !selector ){
                return this;
            };
            //str
            if( typeof selector == 'string'){
                //�����html�ַ���
                if( selector.charAt( 0 ) == '<'){
                    //���ַ���ת��Ϊdom ���ӵ�this��
                    [].push.apply( this,poplar.praseHTML( selector ));
                }else{
                    //�����ѡ���� ��ȡԪ�ؼӵ�this��
                    [].push.apply( this,poplar.select( selector ))
                };
                return this
            }
            //function
            if( typeof selector == 'function'){
                var oldFunc = window.onload;
                if( typeof oldFunc === 'function' ){
                    //selector();
                    //oldFunc();
                    window.onload= function () {
                        oldFunc();
                        selector();
                    }

                } else {
                    selector();
                }

            }
            //dom
            if( selector.nodeType ){

                this[0] = selector;
                this.length = 1;
                return this;
            }

            //poplar
            if ( selector.type =='poplar' ){
                [].push.apply( this,selector )
            }

            //����
            if(selector.length >= 0){
                [].push.apply( this,selector )
            }else{
                this[0] = selector;
                this.length = 1;
            }
            return this;

            //��֪����Ĭ��return this

        },
        //ʵ���е�each
        each: function ( callback ) {

            poplar.each( this, callback );
            return this;
        },
        map: function (callback) {
            return poplar.map(this.callback)
        },
        //��poplar�Ķ���ת�������鷵��
        toArray: function () {
            return [].slice.call(this,0)
        },

        //���ݲ�������DOM�������DOM����

        get: function (index) {
            if( index==undefined){
                return this.toArray();
            }else{
                if(index>0){
                    return this[index];
                }else{
                    return this[this.length+index];
                }
            }
        },

        //����poplar����
        eq: function (index) {
            var newObj = this.constructor( this.get( index ));
            newObj.prev = this;
            return newObj;
        },

        first: function () {
            return this.eq(0)
        },

        last: function () {
            return this.eq(-1)
        },

        each: function (callback) {
            poplar.each(this,callback);
            return this;
        },
        map: function (callback) {

            return poplar.map(this,callback);
        },



    }
    //Ϊ���ù��캯����ʵ��������Ժܷ������ӷ�����
    //��poplar��init��ԭ��ָ��ͬһ������
    poplar.fn.init.prototype = poplar.fn;

    //��� extend ����
    poplar.extend = poplar.fn.extend = function (obj) {
        for ( var k in obj ){
            this[k] = obj[k];
        }
    }

    //����ģ�鹤�߷���
    //��Ӻ���ģ��ķ���


    poplar.extend({
        each: function (array, callback) {
            if( array.length >=0 ){
                for( var i = 0; i< array.length;i++){
                    var res = callback.call(array[i],i,array[i]);
                    if(res=false){
                        break;
                    }
                }
            }else{
                for( var k in array){
                    var res = callback.call(array[k],k,array[k]);
                    if(res=false){
                        break;
                    }
                }
            }
        },
        map: function (array, callback) {
            var res = [];
            //���� α����
            if ( array.length >= 0) {
                for (var i = 0; i < array.length; i++) {
                    var v = callback(array[i], i);
                    if (v !== undefined) {
                        res.push( v );
                    }
                }
            } else {
                for ( var k in array ){
                    var v = callback( array[ k ], k)
                    if ( v !== undefined ){
                        res.push( v )
                    }

                }
            };
            return res;
        }

    })


    //�¼�׷��
    poplar.fn.extend({
        on:function ( type,callback ){

           return this.each(
                function (i, v) {
                    this[ 'on' + type ] = callback
                }
            )

        }
    })

    //ѡ����
    var select =(function () {
    //����һ��support���� ����ѡ�����ļ�������
        var support = {},
            rnative=/\[native code\]/;


        //���ж�qsa
        support.qsa=rnative.test('document.querySlectorAll');
        support.getElementsByClassName = rnative.test( 'document.getElementByClassName ');
        //��Ϊdocument�����gec��node����Ĳ�һ�� ������Ҫ�ٴ��ж�
        var div = document.createElement( 'div' )
        support.getElementsByClassName2 = rnative.test(' div.createElementsByClassName');
        support.trim = rnative.test( String.prototype.trim)


        //indexOf
        support.indexOf = rnative.test( Array.prototype.indexOf );

        function indexOf( array,search,startIndex){
            startIndex = startIndex || 0;
            if(support.index){
                return array.indexOf( search,startIndex )
            }
            for ( var i = startIndex; i < array.length;i++){
                if( array[i] === search ){
                    return i;
                }
            }
            return -1;
        }

        function unique( arr ){
            var newArr=[];
            for( var i=0; i < arr.length; i++){
                if( indexOf(newArr,arr[i]) == -1){
                    newArr.push(arr[i])
                }
            }
            return newArr
        }


        function trim( str ){
            if( support.trim ){
                return str.trim();
            }
            return str.replace( /^\s+|\s+$/g,'')
        }

        var select= function (selector, results) {
            results = results || [];
            if( support.qsa ){
                push.apply( results,document.querySelectorAll(selector))
                return unique(results )
            }

            return select2(selector, results);
        }

        //�ȴ���push���� ����Ƶ����ԭ�������ʹ�������
        var push=[].push;

        //����push�ļ�������
        try {
            push.apply([], document.getElementsByTagName('*'));
        }
        //}else{
            catch(e) {
            push = {
                apply:function ( a,b ){
                    for(var i = 0;i < b.length;i++){
                        a[a.length++] = b[i];
                    }
                    //return a;
                    return a.length;
                }
            }
        }


        //��������������� �������������
        //֧�־��� ��֧���Լ�ʵ��
        //if( support.getElementsByClassName){
        //    return getElementByClassName;
        //}  (��ʲô������ Ҫ�Լ�ʵ��һ������)

        function byClassName(className,node){
            if( node == document && support.getElementsByClassName ||
                node.nodeType == 1 && support.getElementsByClassName2 ){
                return node.getElementsByClassName
            } else{
                //�Լ�ʵ��
                var list = node.getElementsByTagName('*'),
                    i,
                    arr = [],
                    tempClassName;
                for (  i=0; i < list.length; i++){
                    tempClassName = list[i].getAttribute( className );
                    if( !tempClassName ) continue;
                    if( indexOf( tempClassName.split(''),className) != -1 ){
                        arr.push(arr[i]);
                    }
                }

                return arr;
            }
        }

        //���ֻ�����ѡ����
        function t( tagName,results ){
            results = results || [];
            push.apply(results,document.getElementsByTagName( tagName ));
            return results;
        };
        function c( className,results ){
            results = results || [];
            push.apply(results,byClassName( className ));
            return results;
        };
        function id( idName,results){
            results = results || [];
            var dom =document.getElementById( idName );
            if( dom ){
                push.apply( results, [ dom ]);
            }
            return results;
        }

        function select2( selector,results ){
            //���ַ��� ��spliceת����������� ȥ�����˵Ŀո�
            results = results || [];
            var list = selector.split(',');
            for ( var i=0; i < list.length;i++ ){
                select3( trim(list[i]),results)
            }
            return unique(results)
        }

        function select3( selector,results ){
            //var first = selector.charAt(0);
            var first = selector.charAt( 0 );
            if ( selector.split( ' ' ).length === 1 ) {
                // ����м䲻���пո�, ��ô�Ϳ��ǻ���ѡ����
                if ( selector === '*' ) {
                    return t( selector, results );
                } else if ( first === '#' ) {
                    return id( selector.slice( 1 ), results );

                } else if ( first === '.' ) {
                    return c( selector.slice( 1 ), results );

                } else {
                    return t( selector, results );
                }
            } else {
                // ����������ѡ����
                throw new Error( '��ǰ�汾����֧�ָ�ѡ����, ����ϵ .....' );
            }
        }


        return select;

    })();

    poplar.select = select;

    //ģ���е�ʵ������








    //DOM����������
    poplar.praseHTML=(function (  ) {
        var node=document.createElement('div');
        function praseHTML( str ){
            node.innerHTML = str;
            var arr = [];
            arr.push.apply( arr, node.childNodes );
            return arr;
        }
        return praseHTML;
    })()
    //DOMʵ������
    poplar.extend({
        append: function ( parent,element ) {
            parent.appendChild( element );
        },
        prepend: function (parent, element) {
            parent.insertBefore( element,parent.fristChild)
        }
    })


    poplar.fn.extend( {

        appendTo: function ( selector ) {
            var iObj = this.constructor( selector),
                newObj = this.constructor(),
                tObj,
                arr = [];
            for ( var i =0; i < iObj.length; i++){
                for ( var j = 0; j < this.length; j++){
                    tObj = i = iObj.length - 1 === 0
                                                ?this[j]
                                                :this[j].cloneNode( true );
                    arr.push( tObj )
                    poplar.append(iObj[i],tObj)
                }
                push.apply(newObj,arr);
                newObj.prev = this;
                return newObj;
            }
        },

        append: function ( selector ) {
            this.constructor( selector ).appendTo( this );
            return this;
        },

        prependTo: function (selector) {
          var iObj = this.constructor(selector),
              tObj = {},
              newObj = this.constructor(),
              arr = [];
            for ( var i=0; i < iObj.length; i++){
                for ( var j = 0; j < this.length; j++ ){
                    tObj = i === iObj.length - 1
                                ? this[j]
                                :this[j].cloneNode( true );
                    arr.push(tObj);
                    poplar.prepend( iObj[i],tObj)

                }
            }
                [].push.apply(newObj,arr);
                newObj.prev = this;
                return newObj;
        },

        end: function () {
            return this.prev || this;
        },

        prepend: function ( selector ) {
            this.constructor( selector).prependTo(this);
            return this;
        }
    })
    // �¼�����
    Itcast.fn.extend({
        on: function ( type, callback ) {
            return this.each(function ( i, v ) {
                this.addEventListener( type, callback );
            });
        },
        off: function ( type, callback ) {
            return this.each(function () {
                this.removeEventListener( type, callback );
            });
        }
    });

    Itcast.each( ("onblur,onfocus,onclick,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout," +
    "onmouseover,onmouseup,onmousewheel,onkeydown,onkeypress,onkeyup").split(','), function ( i, v ) {

        // ��ʱ v ��ÿһ�� �¼�, ���� 'onclick', ȥ�� on, slice( 2 )
        var event = v.slice( 2 );
        Itcast.fn[ event ] = function ( callback ) {
            return this.on( event, callback );
        };

    });


    Itcast.extend({
        getStyle: function ( dom, name ) {
            if ( dom.currentStyle ) {
                // IE �Ͱ汾
                return dom.currentStyle[ name ];
            } else {
                return window.getComputedStyle( dom )[ name ];
            }
        }

    });

    Itcast.fn.extend({

        css: function ( name, value ) {
            if ( typeof name === 'string' && typeof value === 'string' ) {
                // ������������
                // ��������
                this.each(function () {
                    // this ���� DOM ����
                    this.style[ name ] = value;
                });

            } else if ( typeof name === 'string'  && value === undefined ) {
                // ��ȡ��ʽֵ
                return Itcast.getStyle( this.get( 0 ), name );
            } else if ( typeof name === 'object' && value === undefined ) {
                // ������Ӷ����ʽ
                this.each(function () {
                    // this ���� DOM ����
                    for ( var k in name ) {
                        this.style[ k ] = name[ k ];
                    }

                    /*
                     var that = this;
                     I.each( name, function ( k, v ) {
                     that.style[ k ] = v;
                     });
                     */
                });
            }
            return this;
        },

        addClass: function ( name ) {

            // ����ÿһ�� DOM ����, ���û�и������Ծͼ���
            this.each(function () {
                // this �� DOM ����
                var value = this.className; // undefiend, "   "
                // 'c1 c2 c3'
                if ( !value ) {  // û�� ��������
                    this.className = name;
                } else if ( value.split( ' ' ).indexOf( name ) == -1 ) {
                    this.className += ' ' + name;
                }
            });

            return this;
        },
        removeClass: function ( name ) {
            // ������о��Ƴ�, ���û�оͲ���
            // Ӧ�ÿ���ѭ���Ƴ�
            // ��������û������ͬ��������, Ӧ��ȫ���Ƴ�
            // ѭ���Ƴ�
            this.each(function () {
                // this ���� DOM Ԫ��
                var value = this.className;
                // ��Ҫ�Ƴ����� value �е� name ֵ
                var arr = value.split( ' ' );
                var tmp;

                while ( ( tmp = arr.indexOf( name ) ) != -1 ) {
                    arr.splice( tmp, 1 );
                }

                // ��ֵ�� this.className
                this.className = arr.join( ' ' );
            });
            return this;
        },
        hasClass: function ( name ) {

            // �������Ǻ��� �ľ��Ƿ��� true
            var res = this.map(function ( v, i ) {
                // v ���� DOM Ԫ��
                // ��� v.className �� ���� name �ͷ���һ�� true
                // Ϊ�˿��Լ��ٸ�����ж�, ���ǿ��� true �� return
                var arr = v.className.split( ' ' );

                if ( arr.indexOf( name ) != -1 ) {
                    return true; // ���������, ��ô�Ͳ�����, ֻ�к��е�ʱ��ŷ���
                }
            });
            return res.length > 0;

            // ES5 ���� some
            // this ��α����
            /*
             return [].slice.call( this, 0 ).some(function ( v, i ) {
             return new RegExp( '\\b' + name + '\\b', 'g' ).test( v.className )
             });*/
        },

        toggleClass: function ( name ) {
            var that = this;
            this.each( function () {
                if ( that.constructor( this ).hasClass( name ) ) {
                    // ��
                    that.constructor( this ).removeClass( name );
                } else {
                    // û��
                    that.constructor( this).addClass( name );
                }
            });
            return this;
        }

    });


// ���Բ���
    Itcast.fn.extend({

        attr: function ( name, value ) {

            if ( typeof name === 'string' && typeof value === 'string' ) {
                this.each(function () {
                    // this DOM ����
                    this.setAttribute( name, value );
                });
            } else if (typeof name === 'string' && value === undefined ) {
                return this[ 0 ].getAttribute( name );
            } else if ( typeof name === 'object' && value === undefined ) {
                this.each(function () {
                    for ( var k in name ) {
                        this.setAttribute( k, name[ k ] );
                    }
                });

            }
            return this;
        },

        removeAttr: function ( name ) {
            if ( typeof name === 'string' ) {
                this.each( function () {

                    // this ���� DOM ����
                    this.removeAttribute( name );
                });

            }
            return this;
        },


        prop: function ( name, value ) {

            if (typeof name === 'string' && typeof value === 'function') {
                this.each(function (v, i) {
                    // this DOM ����
                    this[name] = value.call(this, this, i);
                });
            } else if (typeof name === 'string' && typeof value === 'boolean') {
                this.each(function () {
                    // this DOM ����
                    this[name] = value;
                });
            } else if (typeof name === 'string' && value === undefined) {
                return this[0][name];
            } else if (typeof name === 'object' && value === undefined) {
                this.each(function () {
                    for (var k in name) {
                        this[k] = name[k];
                    }
                });

            }
            return this;
        }
        })


    //Ϊ�˷�����д�ͱ����ظ�
    window.poplar = window.Y = poplar;

})( window )
