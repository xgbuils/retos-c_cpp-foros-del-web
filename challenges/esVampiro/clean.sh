#!/bin/bash

for d in participantes/*/*/; do
    participante=`echo $d | sed 's/^participantes\///'`;
    participante=`echo $participante | sed 's/\/.*$//'`;
    rm `ls $d$participante*.o`;
    rm `ls $d"test"*`;
    rm $d"makefile";
done;