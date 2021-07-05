
# Coin puzzle

- red coin = 2
- corroded coin = 3
- shiny coin = 5
- concave coin = 7
- blue coin = 9

=> x1 + x2 * x3^2 + x4^3 - x5 = 399
=> [9, 2, 5, 7, 3]


# Binary notes

## General notes

- Arrays are stored as [size, elt_0, elt_1, ..., elt_{size-1}]
- Strings are arrays of char
- An object is a struct:
    {
        &string: name,
        &string: description,
        flag: obtained,   // 0 if obtained else -1
        &function: use    // &function if can be used else 0
    }


## String addresses

- Address &28037 = string `Your inventory:\n`, but encrypted (xor-ed with 3325)
- Address &28135 = string `You can't find that in your pack.` xor-ed with 10988
- Address &28170 = string `You aren't sure how to use that.` xor-ed with 23805
- Address &28844 = string `A strange, electronic voice is projected into your mind:\n\n "Unusual setting detected!  Starting confirmation process!  Estimated time to completion: 1 billion years."` xor-ed with 5483
- Address &29400 = string `A strange, electronic voice is projected into your mind:\n\n "Miscalibration detected!  Aborting teleportation!"\n\nNothing else seems to happen.\n` xor-ed with 12144
- Address &29545 = string `You activate the teleporter!  As you spiral through time and space, you think you see a pattern in the stars...` xor-ed with 27771
- Address &29667 = string `\nAfter a few moments, you find yourself back on solid ground and a little disoriented.` xor-ed with 1509


## Object addresses

- Address &25974 = input string
- Address &27398 = array of commands name
                 = [7, &'go', &'look', &'help', &'inv', &'take', &'drop', &'use']
                 = [7, 25943, 25946,   25951,   25956,  25960,   25965,   25970 ]

- Address &27406 = array of functions to execute for each command
                 = [7, &go(), &look(), &help(), &inv(), &take(), &drop(), &use()]
                 = [7, 3245,  2964,    3333,    3362,   3400,    3488,    3568  ]

- Address &27381 = array of pointers to all objects possible
                 = [16, &tablet, &empty_lantern, &full_lantern, &lit_lantern, &can, &red_coin, &corroded_coin, &shiny_coin, &concave_coin, &blue_coin, &teleporter,
                 = [16, 2668,    2672,           2676,          2680,         2684, 2688,      2692,           2696,        2700,          2704,       2708,
                    ...
                    &business_card, &strange_book, &journal, &orb, &mirror]
                    2712,           2724,          2728,     2716, 2720   ]


# Objects descriptions

## Strange book

Object: strange book
Description:
The cover of this book subtly swirls with colors.  It is titled "A Brief Introduction to Interdimensional Physics".  It reads:

Recent advances in interdimensional physics have produced fascinating
predictions about the fundamentals of our universe!  For example,
interdimensional physics seems to predict that the universe is, at its root, a
purely mathematical construct, and that all events are caused by the
interactions between eight pockets of energy called "registers".
Furthermore, it seems that while the lower registers primarily control mundane
things like sound and light, the highest register (the so-called "eighth
register") is used to control interdimensional events such as teleportation.

A hypothetical such teleportation device would need to have have exactly two
destinations.  One destination would be used when the eighth register is at its
minimum energy level - this would be the default operation assuming the user
has no way to control the eighth register.  In this situation, the teleporter
should send the user to a preconfigured safe location as a default.

The second destination, however, is predicted to require a very specific
energy level in the eighth register.  The teleporter must take great care to
confirm that this energy level is exactly correct before teleporting its user!
If it is even slightly off, the user would (probably) arrive at the correct
location, but would briefly experience anomalies in the fabric of reality
itself - this is, of course, not recommended.  Any teleporter would need to test
the energy level in the eighth register and abort teleportation if it is not
exactly correct.

This required precision implies that the confirmation mechanism would be very
computationally expensive.  While this would likely not be an issue for large-
scale teleporters, a hypothetical hand-held teleporter would take billions of
years to compute the result and confirm that the eighth register is correct.

If you find yourself trapped in an alternate dimension with nothing but a
hand-held teleporter, you will need to extract the confirmation algorithm,
reimplement it on more powerful hardware, and optimize it.  This should, at the
very least, allow you to determine the value of the eighth register which would
have been accepted by the teleporter's confirmation mechanism.

Then, set the eighth register to this value, activate the teleporter, and
bypass the confirmation mechanism.  If the eighth register is set correctly, no
anomalies should be experienced, but beware - if it is set incorrectly, the
now-bypassed confirmation mechanism will not protect you!

Of course, since teleportation is impossible, this is all totally ridiculous.

## Journal

Object: journal
Description:
Fireflies were using this dusty old journal as a resting spot until you scared them off.  It reads:

Day 1: We have reached what seems to be the final in a series of puzzles guarding an ancient treasure.  I suspect most adventurers give up long before this point, but we're so close!  We must press on!

Day 1: P.S.: It's a good thing the island is tropical.  We should have food for weeks!

Day 2: The vault appears to be sealed by a mysterious force - the door won't budge an inch.  We don't have the resources to blow it open, and I wouldn't risk damaging the contents even if we did.  We'll have to figure out the lock mechanism.

Day 3: The door to the vault has a number carved into it.  Each room leading up to the vault has more numbers or symbols embedded in mosaics in the floors.  We even found a strange glass orb in the antechamber on a pedestal itself labeled with a number.  What could they mean?

Day 5: We finally built up the courage to touch the strange orb in the antechamber.  It flashes colors as we carry it from room to room, and sometimes the symbols in the rooms flash colors as well.  It simply evaporates if we try to leave with it, but another appears on the pedestal in the antechamber shortly thereafter.  It also seems to do this even when we return with it to the antechamber from the other rooms.

Day 8: When the orb is carried to the vault door, the numbers on the door flash black, and then the orb evaporates.  Did we do something wrong?  Doesn't the door like us?  We also found a small hourglass near the door, endlessly running.  Is it waiting for something?

Day 13: Some of my crew swear the orb actually gets heaver or lighter as they walk around with it.  Is that even possible?  They say that if they walk through certain rooms repeatedly, they feel it getting lighter and lighter, but it eventually just evaporates and a new one appears as usual.

Day 21: Now I can feel the orb changing weight as I walk around.  It depends on the area - the change is very subtle in some places, but certainly more noticeable in others, especially when I walk into a room with a larger number or out of a room marked '*'.  Perhaps we can actually control the weight of this mysterious orb?

Day 34: One of the crewmembers was wandering the rooms today and claimed that the numbers on the door flashed white as he approached!  He said the door still didn't open, but he noticed that the hourglass had run out and flashed black.  When we went to check on it, it was still running like it always does.  Perhaps he is going mad?  If not, which do we need to appease: the door or the hourglass?  Both?

Day 55: The fireflies are getting suspicious.  One of them looked at me funny today and then flew off.  I think I saw another one blinking a little faster than usual.  Or was it a little slower?  We are getting better at controlling the weight of the orb, and we think that's what the numbers are all about.  The orb starts at the weight labeled on the pedestal, and goes down as we leave a room marked '-', up as we leave a room marked '+', and up even more as we leave a room marked '*'.  Entering rooms with larger numbers has a greater effect.

Day 89: Every once in a great while, one of the crewmembers has the same story: that the door flashes white, the hourglass had already run out, it flashes black, and the orb evaporates.  Are we too slow?  We can't seem to find a way to make the orb's weight match what the door wants before the hourglass runs out.  If only we could find a shorter route through the rooms...

Day 144: We are abandoning the mission.  None of us can work out the solution to the puzzle.  I will leave this journal here to help future adventurers, though I am not sure what help it will give.  Good luck!


# Heavy function

h = int(input())
def f(a, b):
    if a == 0:
        return b+1
    if b == 0:
        return f(a-1, h)
    return f(a-1, f(a, b-1))

f(4, 1) == 6 when h = 25734
