<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExpireAppointment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expire:appointment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Appointment Expiration code every minutes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $date = date('Y-m-d',strtotime('now'));
        $time = date('h:i:s',strtotime('now'));

        $response = node_response(['date' => $date, 'time' => $time],'api/appointment/expire/status');
    
        echo "<pre style='color:red;'>";
        print_r($response);
        echo "</pre>";
        exit;

        return 0;
    }
}
