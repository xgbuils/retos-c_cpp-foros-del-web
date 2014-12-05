#!/bin/bash
if [ "$1" = "" -o "$1" = "tests" -o -e "$1" ]; then
    createTests=true;
else
    createTests=false;
fi;
echo $createTests;

if [ $createTests = true -o "$1" = "makefiles" ]; then
    echo hola;
    for test in tester/*.c; do
        test_c=`echo $test | sed 's/^tester\///'`;
        test_o=${test_c/.c/.o};
        for d in participantes/*/*/; do
            
            participante=`echo $d | sed 's/^participantes\///'`
            participante=`echo $participante | sed 's/\/.*$//'`
            #echo "    "$participante;
            for f in `echo $d$participante*.c`; do
                file_c=`echo $f | sed 's/participantes\/[^/]*\/[^/]*\///'`;
    
                file_o=${file_c/.c/.o};
                mkfl=$d"makefile";
                conf=`cat $d${file_c/.c/.conf}`;
                
                printf "void ${test_c/.c/}();\n" > "tester/"${test_c/.c/.h};
    
                printf "#include \"../../../prototipo.h\"\n#include \"../../../tester/${test_c/.c/.h}\"\nint main(void) {${test_c/.c/}(); return 0; }\n" > $d$test_c;
                printf "$conf\n${test_c/.c/}: ../../../tester/$test_o $file_o\n\t\$(CC) -o \$@ $test_c \$+ \$(CFLAGS)\n\n../../../tester/$test_o: ../../../tester/$test_c\n\t\$(CC) -c \$< \$(CFLAGS)\n\tmv $test_o ../../../tester/\n\n$file_o: $file_c\n\t\$(CC) -c \$< \$(CFLAGS)\n" > $d"makefile";
            done;
        done;
    done;
fi;

if [ $createTests = true ]; then
    echo $createTests;
    cd participantes;
    for d in */*/; do
        echo $d;
        cd $d;
        make -s;
        test=`echo test*.c | sed 's/\.c$//'`;
        time timeout 120 ./$test; 
        cd ../..;
    done;
    cd ..;
fi;