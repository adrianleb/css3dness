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
    @camera.position.set( -500, 0, 0 )
    # @camera.element.webkitRequestPointerLock()
    # @controls = new THREE.FlyControls(@camera)
    @controls = new THREE.FirstPersonControls(@camera)
    @controls.movementSpeed = 100
    @controls.lookSpeed = 0.039
    @controls.lookVertical = false #// Don't allow the player to look up or down. This is a temporary fix to keep people from flying
    @controls.noFly = true #// Don't allow hitting R or F to go up or down
    @controls.activeLook = false
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


    @scene.add cubeWrap
    @cubez.push cubeWrap





  buildEls: ->
    @scene = new THREE.Scene()

    cubeCount = 10
    @cubez = []

    for i in [0...cubeCount]
      size = Math.random() * 30
      coords = 
        x: Math.random() * 300
        y: Math.random() * 20
        z: Math.random() * 300

      @makeCube size,coords
      

    @renderer = new THREE.CSS3DRenderer()
    @renderer.setSize( window.innerWidth, window.innerHeight)
    @renderer.domElement.style.position = 'absolute'
    @renderer.domElement.style.top = 0
    console.log @renderer.domElement, @scene
    $('body').append @renderer.domElement




  haveFun: ->

    for cube in @cubez
      cube.rotation.x +=0.05# * Math.random() 
      cube.rotation.y +=0.04
      cube.rotation.z +=0.03
      # cube.position.z +=0.4



  animate: ->
    # unless not @allowedToRender
    requestAnimationFrame( yolo.animate )


    yolo.haveFun()

    delta = yolo.clock.getDelta()
    yolo.controls.update(delta)
    yolo.renderer.render( yolo.scene, yolo.camera )





















(->
  window.yolo = new Yolo()
  setTimeout ( ->
    yolo.animate()
    # yolo.controlRendering 'start'
    console.log 'yolo'
  ), 500

)()