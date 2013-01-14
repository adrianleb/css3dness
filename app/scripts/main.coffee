window.cl = (o) ->
  console.debug(o)

class Space
  distance: (a, b) ->
    return Math.abs(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)))

class Vector
  constructor: (@x = 0, @y = 0, @z = 0) ->

class Object
  constructor: (@_name) ->
    @_position = new Vector()

  getPosition: () ->
    @_position

  setPosition: (@_position) ->

  getName: ->
    @_name

  draw: ->
    s = $('<section data-bind="' + @_name + '">')
    s.append($('<h2>' + @_name + ':</h2>'))
    _.each ['x', 'y', 'z'], (k) =>
      l = $('<label>')
      l.html(k + ': ')
      s.append(l)

      i = $('<input type="text">')
      i.attr('name', k)
      i.val(@_position[k])
      s.append(i)

    $('.container').append(s)


class Producer extends Object

  constructor: (name) ->
    super name
    @out = context.createOscillator()
  
  start: ->
    @out.noteOn(0)

  stop: ->
    @out.noteOff(0)

  loop: ->
    # nothing here
    # cl('loop. producer')

class Listener extends Object
  producers: []

  constructor: (name) ->
    super name

  listen: (producer) ->
    gainNode = context.createGainNode()
    producer.out.connect(gainNode)

    @producers.push
      producer: producer
      gainNode: gainNode

    gainNode.connect(context.destination)

  loop: ->
    # calculate the distance between itself and all the producers adjusting their gains acordingly
    _.each @producers, (o) =>
      distance = space.distance(@getPosition(), o.producer.getPosition())
      value = 1 / Math.pow(distance, 2)
      o.gainNode.gain.value = if value > 1 then 1 else value
      $('.gain').html(o.gainNode.gain.value)

class Dessau
  constructor: ->
    # @producer = new Producer('producer')
    # @listener = new Listener('listener')

    # @listener.listen(@producer)

    # @producer.start()

    # @loop()

    # # arrg!
    # # @producer.draw()
    # @listener.draw()
    # $('input').keyup (e) =>
    #   # update the position of the object
    #   objName = $(e.target).parent().data('bind')
    #   cl($(e.target).parent())
    #   attrName = $(e.target).attr('name')
    #   p = @[objName].getPosition()
    #   newVal = parseInt($(e.target).val())
    #   unless isNaN(newVal)
    #     p[attrName] = newVal
    #     @[objName].setPosition(p)

    #     # draw the distance
    #     $('.distance').html(space.distance(@producer.getPosition(), @listener.getPosition()))


  # # very silly game loop
  # loop: ->
  #   _.each [@producer, @listener], (o) ->
  #     o.loop()

  #   setTimeout((=>
  #     @loop()), 100)


class Yolo

  constructor: ->
    # @renderer = 'hai'
    @buildCam()
    @buildEls()
    @clock = new THREE.Clock()
    # @buildControls()
    @allowedToRender = true
    
    console.log 'built something?'







  buildCam: ->
    @camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight/2, 1, 100 )
    @camera.position.set( 0, 0, 0 )
    @listener = new Listener('listener')
    # @camera.element.webkitRequestPointerLock()
    # @controls = new THREE.FlyControls(@camera)
    @controls = new THREE.FirstPersonControls(@camera)
    @controls.movementSpeed = 300
    @controls.lookSpeed = 0.039
    @controls.lookVertical = false #// Don't allow the player to look up or down. This is a temporary fix to keep people from flying
    @controls.noFly = true #// Don't allow hitting R or F to go up or down
    @controls.activeLook = true
    # @controls.rollSpeed = 0.205;
    # @controls.lookVertical = true
    @



  buildControls: ->

    $(document).on 'click', '.media_each', (e) =>
      console.log @, e, e.currentTarget

    $(window).on 'keydown', (e) =>

      key = e.which
      @holdingShift = true if key is 16
      # @controls.activeLook = true if @holdingShift
      switch key
        when 37 then @camera.position.x--
        when 39 then @camera.position.x++
        when 38 then ( if @holdingShift then @camera.position.y-- else @camera.position.z-- )
        when 40 then ( if @holdingShift then @camera.position.y++ else @camera.position.z++ )

    $(window).on 'keyup', (e) =>
      # unless not @allowedToRender 
        # @controlRendering 'stop'
      key = e.which
      @holdingShift = false if key is 16
      console.log @holdingShift
      false


  $(window).on 'blur', (e) =>
    console.log 'yolo out'

  $(window).on 'focus', (e) =>
    console.log 'yolo back'



  makeCube: (size, pos) ->
    wrapEl = document.createElement( 'section' )
    wrapEl.style.width = '200px'
    wrapEl.style.height = '200px'
    wrapEl.classList.add 'box_wrap'


    cubeWrap = new THREE.CSS3DObject(wrapEl)
    @centerVector = new THREE.Vector3()


    faces = []

    for i in [0...6]

      img = new Image()
      img.src = "http://placekitten.com/1000/#{i + 1000}"
      face = document.createElement( 'div' )
      face.appendChild img
      face.style.background = 'red'
      face.style.width = size * 2 + "px"
      face.style.height = size * 2 + "px"
      face.classList.add 'box_face'
      # faces[i].element.style.background = "hsl(#{i*20}, 50%, 50%)"


      # create the 3dobject
      faces[i] = new THREE.CSS3DObject(face)

      # add to parent 3dobject
      cubeWrap.add faces[i]
    

    faces[2].position.z = faces[3].position.x = faces[5].position.y = -size
    faces[0].position.z = faces[1].position.x = faces[4].position.y = size


    for i in [0..faces.length-1]
      faces[i].lookAt @centerVector


    cubeWrap.position.set(pos.x, pos.y, pos.z)
    # make it sing
    producer = new Producer('producer')
    gainNode = context.createGainNode()

    producer.out.connect(gainNode)
    gainNode.connect(context.destination)
    producer.start()
    # @listener.listen(producer)

    @scene.add cubeWrap
    @cubez.push {
      obj: cubeWrap
      producer: producer
      gainNode: gainNode
    }





  buildEls: ->
    @counter = 0 
    @scene = new THREE.Scene()
    @producers = []

    cubeCount = 10
    @cubez = []

    for i in [0...cubeCount]
      size = Math.random() * 30
      coords = 
        x: Math.random() * 3000
        y: Math.random() * 5
        z: Math.random() * 3000

      @makeCube size,coords
      

    @renderer = new THREE.CSS3DRenderer()
    @renderer.setSize( window.innerWidth, window.innerHeight)
    @renderer.domElement.style.position = 'absolute'
    @renderer.domElement.style.top = 0
    console.log @renderer.domElement, @scene
    $('body').append @renderer.domElement
    @moveThem()




  moveThem: ->
    coords = 
        x: Math.random() * 3000
        y: Math.random() * 5
        z: Math.random() * 3000

    for cube in @cubez
      console.log cube
      # @transform cube.obj, coords, 1000

  # transform: (object, target, duration) ->

  #   TWEEN.Tween( object )
  #           .to( { x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration )
  #           .easing( TWEEN.Easing.Exponential.InOut )
  #           .start()

  #   @


  haveFun: ->

    for cube in @cubez
      cube.obj.rotation.x +=0.05# * Math.random() 
      cube.obj.rotation.y +=0.04
      cube.obj.rotation.z +=0.03

      distance = space.distance(@controls.target, cube.obj.position)

      # crazyness
      value = (1 / Math.pow((distance), 2)) * 10000
      cube.gainNode.gain.value = if value > 1 then 1 else value
      if @counter < 200
        console.log value, distance, @controls.target, cube.obj.position
        @counter++
      # cube.position.z +=0.4

    # _.each @producers, (o) =>



  animate: ->
    # unless not @allowedToRender
    requestAnimationFrame( yolo.animate )


    yolo.haveFun()
    TWEEN.update()
    delta = yolo.clock.getDelta()
    yolo.controls.update(delta)
    yolo.renderer.render( yolo.scene, yolo.camera )



















(->
  window.space = new Space()
  window.context = new webkitAudioContext()
  # window.dessau = new Dessau()
  window.yolo = new Yolo()

  setTimeout ( ->
    yolo.animate()
    # yolo.controlRendering 'start'
    console.log 'yolo'
  ), 500

)()