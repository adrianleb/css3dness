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
    @listener = new Listener('listener')

    @listener.listen(@producer)

    @producer.start()

    @loop()

    # arrg!
    @producer.draw()
    @listener.draw()
    $('input').keyup (e) =>
      # update the position of the object
      objName = $(e.target).parent().data('bind')
      cl($(e.target).parent())
      attrName = $(e.target).attr('name')
      p = @[objName].getPosition()
      newVal = parseInt($(e.target).val())
      unless isNaN(newVal)
        p[attrName] = newVal
        @[objName].setPosition(p)

        # draw the distance
        $('.distance').html(space.distance(@producer.getPosition(), @listener.getPosition()))


  # very silly game loop
  loop: ->
    _.each [@producer, @listener], (o) ->
      o.loop()

    setTimeout((=>
      @loop()), 100)

# (->
#   window.space = new Space()
#   window.context = new webkitAudioContext()
#   window.dessau = new Dessau()
# )()
