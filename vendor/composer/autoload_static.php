<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitef0e79c772f590f485dbc75db16c80e3
{
    public static $prefixLengthsPsr4 = array (
        'T' => 
        array (
            'TomatoPHP\\LaravelAgora\\' => 23,
            'TomatoPHP\\ConsoleHelpers\\' => 25,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'TomatoPHP\\LaravelAgora\\' => 
        array (
            0 => __DIR__ . '/..' . '/tomatophp/laravel-agora/src',
        ),
        'TomatoPHP\\ConsoleHelpers\\' => 
        array (
            0 => __DIR__ . '/..' . '/tomatophp/console-helpers/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitef0e79c772f590f485dbc75db16c80e3::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitef0e79c772f590f485dbc75db16c80e3::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitef0e79c772f590f485dbc75db16c80e3::$classMap;

        }, null, ClassLoader::class);
    }
}
